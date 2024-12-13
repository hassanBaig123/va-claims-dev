import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { questionnaireDataset_Supplementary } from '@/constants'
import { getProductDetails } from '@/utils/data/products/productUtils'
import { recordPurchaseAdmin } from '@/utils/users/purchaseManagement'

export async function PUT(req: Request, res: Response) {
  const supabaseAdmin = await createClient(process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY)

  // Get form from the request
  const { user_id, conditions } = await req.json()
  console.info("Supplementary form request for user:", user_id);
  console.info("conditions:", conditions);

  const allProducts = conditions.flatMap((cond: any) => cond.products)
  await Promise.all(allProducts.map(async (prod: any) => {
    const product = await getProductDetails(prod)
    if (!product) {
      return { error: 'Product not found or inactive' }
    }
    const price = product.prices[0]?.unit_amount ?? 0
    await recordPurchaseAdmin({
      userId: user_id,
      amount: price,
      productId: product.id,
    })
  }))

  // Filter out duplicate conditions
  const uniqueConditions = await
    getUniqueConditions(conditions, user_id, true)

  // Create a supplementary form for each condition
  for (const condition of uniqueConditions) {
    const supplementaryFormPages =
      questionnaireDataset_Supplementary.pages.filter((page) => {
        if (!page.categories) return true
        return condition && page.categories.includes(condition.category)
      })

    const supplementaryForm = {
      questions: supplementaryFormPages.flatMap(
        (page: Page) =>
          page.questions.flatMap((question: Question) => question) || [],
      ),
      condition: condition,
      answers: {},
    }

    const { data: newSupplementaryForm, error: supplementaryFormError } =
      await supabaseAdmin
        .schema('public')
        .from('forms')
        .insert({
          type: 'supplemental',
          user_id: user_id,
          title: `Condition Detail Builder for ${condition.label}`,
          status: 'created',
          report_type: condition.report_type,
          form: JSON.stringify(supplementaryForm),
        } as any)
        .select()
        .single()

    if (supplementaryFormError) {
      console.log(
        'Error creating supplementary form:',
        supplementaryFormError,
      )
    } else {
      console.log('Created supplementary form:',)
    }
  }


  return NextResponse.json({ url: `${process.env.ALLOWED_ORIGIN || ''}/todos` }, { status: 200 });
}

export const getUniqueConditions = async (conditions: any, user_id: any, isAdditionalReport: boolean) => {
  const supabaseAdmin = await createClient(process.env.SUPABASE_AUTH_SERVICE_ROLE_KEY)

  return await Promise.all(conditions.map(async (condition: any) => {
    const query = supabaseAdmin
      .schema('public')
      .from('forms')
      .select('title, report_type')
      .eq('user_id', user_id)
      .ilike('title', `%${condition.label}%`)

    const { data: existingForms, error: existingFormsError } = await query

    if (existingFormsError) {
      console.log('Error fetching existing forms:', existingFormsError)
      return null
    }

    return existingForms?.length > 0 ? null : condition
  })).then(results => {
    const filteredResults = results.filter(Boolean)
    console.log('Unique conditions:', filteredResults);
    console.log('All Conditions Count:', conditions?.length);
    console.log('Unique Conditions Count:', filteredResults.length);

    return filteredResults
  })

}