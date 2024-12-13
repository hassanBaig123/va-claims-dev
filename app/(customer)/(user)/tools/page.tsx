'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import UserToolsComponent from '@/components/tools-page/userNewToolsComponent'

const Tools = () => {
  const router = useRouter()

  return (
    <div>
      <UserToolsComponent />
    </div>
  )
}

export default Tools
