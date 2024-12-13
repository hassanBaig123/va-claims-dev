'use client'
import { getUser } from '@/actions/user.server'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Loader from '@/components/global/Loader'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
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

      if (userError || !user) {
        router.push('/not-authorized')
        return
      }

      router.push(`/profile/${user.id}`)
    }

    fetchUser()
  }, [router])

  return (
    <div className="bg-white flex items-center justify-center min-h-screen fixed z-50 w-full">
      <Loader /> <span>Loading...</span>
    </div>
  )
}

export default Page
