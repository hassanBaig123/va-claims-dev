'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const ReferralDialog = ({ userMeta, userId }: any) => {
  const [showReferralDialog, setShowReferralDialog] = useState(true)

  console.log('userMeta', userMeta.resource_urls)

  const downloadFiles = async () => {
    const downloadPromises = userMeta.resource_urls.map((fileId: any) =>
      downloadSingleFile(fileId),
    )

    // Wait for all downloads to complete
    await Promise.all(downloadPromises)

    const now = new Date().toISOString()
    const { error: metaError } = await supabase.from('user_meta').insert({
      user_id: userId,
      meta_key: userMeta?.referral_code,
      meta_value: 'downloaded',
      created_at: now,
      updated_at: now,
    })

    if (metaError) {
      console.error('Error saving user meta:', metaError)
    }

    setShowReferralDialog(false)
  }

  const downloadSingleFile = async (fileId: string) => {
    const response = await fetch(`/api/downloads?fileId=${fileId}`)

    if (response.status === 401) {
      throw new Error('UNAUTHORIZED')
    }

    if (!response.ok) {
      throw new Error('Download failed')
    }

    const blob = await response.blob()
    const filename =
      response.headers.get('Content-Disposition')?.split('filename=')[1] ||
      'download'

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return fileId
  }

  return (
    <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader className="bg-primary/5 p-6 rounded-t-lg">
          <DialogTitle className="text-3xl font-bold text-foreground">Welcome!</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-8 space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {userMeta?.welcome_message?.welcome_message}
          </p>
          <Button 
            onClick={downloadFiles} 
            className="hidden sm:flex cta-button font-bold text-xl text-white justify-center items-center gap-[15px] w-[300px] py-[15px] px-[20px] rounded-lg bg-crimsonNew hover:bg-[hsl(356,100%,20%)] active:bg-[hsl(356,100%,30%)] transition duration-300"
          >
            Download Your Packet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReferralDialog
