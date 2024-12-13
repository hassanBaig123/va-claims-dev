import { createClient } from '@/utils/supabase/client'

const updateWatchedVideo = async (
  courseId: string,
  videoId: string,
  userID: string,
) => {
  const supabase = createClient()

  console.log('something got here ', videoId, courseId, userID)
  try {
    // Fetch the user_course entry for the given courseId
    const { data: userCourse, error: fetchError } = await supabase
      .from('user_courses')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', userID)
      .single()

    if (fetchError) {
      throw fetchError
    }

    if (userCourse) {
      const updatedWatchedVideos = {
        ...userCourse.watched_videos,
        [videoId]: true,
      }
      console.log('user course', updatedWatchedVideos)

      const { data, error: updateError } = await supabase
        .from('user_courses')
        .update({ watched_videos: updatedWatchedVideos })
        .eq('course_id', courseId)
        .eq('user_id', userID)

      if (updateError) {
        throw updateError
      }

      return data
    }
  } catch (error) {
    console.error('Error updating watched videos:', error)
    return null
  }
}

export default updateWatchedVideo
