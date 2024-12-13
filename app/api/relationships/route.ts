import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()

  try {
    const { data: relationships, error: relationshipsError } = await supabase
      .schema('public')
      .from('node_relationships')
      .select('id, parent_node_id, child_node_id')

    if (relationshipsError) throw relationshipsError

    const formattedRelationships = relationships.map(rel => ({
      id: rel.id.toString(),
      parent_node_id: rel.parent_node_id?.toString() || '',
      child_node_id: rel.child_node_id?.toString() || '',
    }))

    return new Response(JSON.stringify(formattedRelationships), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching relationships data:', error)
    return new Response(JSON.stringify({ error: 'Error fetching relationships data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
