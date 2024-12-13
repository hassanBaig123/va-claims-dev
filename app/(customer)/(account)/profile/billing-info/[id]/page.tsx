'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { getValidID } from '@/utils/helpers'
import Loader from '@/components/global/Loader'
import { getUser } from '@/actions/user.server'
import { createClient } from '@/utils/supabase/client'
import ProfileBillingPage from './ProfileBillingPage'

const supabase = createClient()

export default function SettingBillingInfoPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [userData, setUserData] = useState<any | null>(null)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true)
  const { user, inspectUserId, isAdmin, isLoading, setAdminInspectUserId } =
    useSupabaseUser()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (isLoading) {
        return
      }

      if (sessionError || !session) {
        router.push('/login')
        return
      }
      if (!user) {
        router.push('/not-authorized')
        return
      }
      let validatedUserId: string | null = null
      if (inspectUserId) {
        validatedUserId = inspectUserId
      } else {
        //if there is not inspectUserId we take it from the URL
        validatedUserId = getValidID(params.id)

        //if validatedUserId is not valid we take if from user?.id
        if (!validatedUserId && user?.id) {
          validatedUserId = getValidID(user.id)
        }
      }

      // Populate data
      if (validatedUserId) {
        // if URL id is not the same then the user
        if (user.id !== validatedUserId) {
          //check if user is admin
          if (!isAdmin) {
            router.push('/not-authorized')
            return
          } else {
            //is admin
            if (validatedUserId !== params.id) {
              router.replace(`/profile/${validatedUserId}`)
            }
            //set validatedUserId
            setAdminInspectUserId(validatedUserId)
          }
        }
        const { data } = await getUser(validatedUserId)
        if (data) {
          setUserData(data)
        }
      }
      setIsPageLoading(false)
    }

    fetchData()
  }, [
    params.id,
    router,
    isLoading,
    inspectUserId,
    isAdmin,
    setAdminInspectUserId,
    user,
  ])

  if (isLoading || isPageLoading) {
    return (
      <div className="bg-white flex items-center justify-center fixed z-50 w-[75%] h-[400px]">
        <Loader /> <span>Loading...</span>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="bg-white flex items-center justify-center min-h-screen fixed z-50 w-full">
        User not found
      </div>
    )
  }

  return <ProfileBillingPage user={userData} />
}
