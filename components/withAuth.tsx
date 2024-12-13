import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import Loader from '@/components/global/Loader'
import { useRouter } from 'next/navigation'
import { NextComponentType, NextPageContext } from 'next'

const supabase = createClient()

const WithAuth =
  (requiredUserLevel: number) =>
  (Component: NextComponentType<NextPageContext, any, {}>) => {
    const WithAuthComponent = (props: any) => {
      const [userLevel, setUserLevel] = useState<number | null>(null)
      const router = useRouter()

      useEffect(() => {
        const fetchUserLevel = async () => {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()

          if (sessionError || !session) {
            router.push('/login')
            return
          }

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser()

          if (
            userError ||
            !user ||
            !user.app_metadata?.userlevel ||
            user.app_metadata.userlevel < requiredUserLevel
          ) {
            router.push('/not-authorized')
            return
          }

          setUserLevel(user.app_metadata.userlevel)
        }

        fetchUserLevel()
      }, [router])

      if (userLevel === null) {
        return (
          <div className="bg-white flex items-center justify-center min-h-screen fixed z-50 w-full">
            <Loader /> <span>Loading...</span>
          </div>
        )
      }

      return <Component {...props} />
    }

    // Setting the display name for easier debugging
    WithAuthComponent.displayName = `WithAuth(${
      Component.displayName || Component.name || 'Component'
    })`

    return WithAuthComponent
  }

export default WithAuth
