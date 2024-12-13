'use client'
import { AuthUser } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'

type SupabaseUserContextType = {
  user: AuthUser | null
  isLoading: boolean
  refreshUser: () => void
  isAdmin: boolean
  inspectUserId: string | null
  setAdminInspectUserId: (userId: string | null) => void
}

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  isLoading: true,
  refreshUser: () => {},
  isAdmin: false,
  inspectUserId: null,
  setAdminInspectUserId: (userId: string | null) => {},
})

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext)
}

interface SupabaseUserProviderProps {
  children: React.ReactNode
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [inspectUserId, setInspectUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  // Line 44-60: Define getUser function with useCallback
  const getUser = useCallback(async () => {
    const session = await supabase.auth.getSession()
    if (session.data.session) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        if (user.app_metadata.userlevel >= 500) {
          setIsAdmin(true)
        }
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }, [supabase])

  const refreshUser = async () => {
    setIsLoading(true)
    await getUser()
  }

  // Line 62-64: Update the useEffect hook
  useEffect(() => {
    getUser()
  }, [getUser])

  const setAdminInspectUserId = (userId: string | null) => {
    setInspectUserId(userId)
  }

  return (
    <SupabaseUserContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        isAdmin,
        inspectUserId,
        setAdminInspectUserId,
      }}
    >
      {children}
    </SupabaseUserContext.Provider>
  )
}
