'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { InlineWidget } from 'react-calendly'
import VideoComponent from './todo-video-component'
import UserTodoBuilderQuestionComponent from './todoBuilderQuestion'
import { createClient } from '@/utils/supabase/client'

interface TodoStepDialogProps {
  children: React.ReactNode
  type: 'builderQA' | 'scheduleCall' | 'video'
  data: {
    scheduleCall?: {
      isDiscoveryCall?: boolean
      userId?: string
    }
    video?: {
      videoUrl?: string
      introVideoWatched?: boolean
      userId?: string
    }
  }
}

const TodoStepDialog: React.FC<TodoStepDialogProps> = ({
  children,
  type,
  data,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open)
    if (!open && type === 'scheduleCall') {
      router.refresh() // Refresh the page only for scheduleCall
    }
  }

  const renderContent = () => {
    switch (type) {
      case 'builderQA':
        return (
          <div className="px-6 py-8 space-y-6">
            <UserTodoBuilderQuestionComponent />
          </div>
        )
      case 'scheduleCall':
        const url = data.scheduleCall?.isDiscoveryCall
          ? 'https://calendly.com/grandmasteronboarding/30min'
          : 'https://calendly.com/grandmasteronboarding/30min'
        return (
          <>
            <DialogHeader className="bg-primary/5 p-6 rounded-t-lg">
              <DialogTitle className="text-3xl font-bold text-foreground">
                {data.scheduleCall?.isDiscoveryCall
                  ? 'Schedule your Discovery Call'
                  : 'Schedule Your Pre-C&P Exam Call'}
              </DialogTitle>
            </DialogHeader>
            <InlineWidget url={url} />
          </>
        )
      case 'video':
        return (
          <>
            <div className="px-6 py-8 space-y-6">
              <div className="flex flex-col lg:h-full w-full justify-start sm:justify-center items-start mt-[0px] lg:mt-[0px]">
                <VideoComponent
                  url={
                    data.video?.videoUrl ||
                    'https://vimeo.com/1020315337?share=copy'
                  }
                />
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  const markIntroVideoDone = async (userId: string) => {
    const supabase = createClient()
    const now = new Date().toISOString()
    const { error: metaError } = await supabase.from('user_meta').insert({
      created_at: now,
      updated_at: now,
      user_id: userId,
      meta_key: 'intro_video_done',
      meta_value: 'true',
    })
  }

  return (
    <>
      <div
        className="flex text-center"
        onClick={async () => {
          setShowDialog(true)
          if (
            type === 'video' &&
            !data.video?.introVideoWatched &&
            data.video?.userId
          ) {
            await markIntroVideoDone(data.video.userId)
          }
        }}
      >
        {children}
      </div>

      <Dialog open={showDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[800px]">
          {renderContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TodoStepDialog
