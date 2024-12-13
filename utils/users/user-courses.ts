// utils/users/courseUtils.ts

import { createClient } from '@/utils/supabase/client'

interface Video {
    url: string
    videoId: string
    lessonType: string
    videoTitle: string
    description: string
}

interface Module {
    videos: Video[]
    moduleId: number
    moduleTitle: string
}

interface CourseContent {
    modules: Module[]
    courseId: string
    courseTitle: string
    courseDescription: string
    coursePreview?: string
}

interface DatabaseCourse {
    id: string
    name: string
    content: string | CourseContent
    product_id: string | null
}

export interface ProcessedCourse {
    id: string // This is the database ID
    name: string
    courseId: string // This is the courseId from the content (if needed)
    courseTitle: string
    courseDescription: string
    coursePreview?: string
    progress: number | null
    nextUnwatchedVideo: Video | null
    content: CourseContent
}

export async function getUserAllCourses(
    userId: string,
): Promise<ProcessedCourse[]> {
    const supabase = await createClient()

    try {
        // Fetch user courses
        const { data: userCourses, error: userCoursesError } = await supabase
            .from('user_courses')
            .select('*')
            .eq('user_id', userId)

        if (userCoursesError) throw userCoursesError

        // Fetch course details
        const { data: courses, error: coursesError } = (await supabase
            .from('courses')
            .select('*')
            .in(
                'id',
                userCourses.map((uc) => uc.course_id),
            )) as { data: DatabaseCourse[]; error: any }

        if (coursesError) throw coursesError

        // Process courses
        const processedCourses = courses.map((course: DatabaseCourse) => {
            const userCourse = userCourses.find((uc) => uc.course_id === course.id)
            const watchedVideos: { [key: string]: boolean } =
                typeof userCourse?.watched_videos === 'string'
                    ? JSON.parse(userCourse.watched_videos)
                    : userCourse?.watched_videos || {}

            const content: CourseContent =
                typeof course.content === 'string'
                    ? (JSON.parse(course.content) as CourseContent)
                    : (course.content as CourseContent)

            const allVideos = content.modules.flatMap((module) => module.videos)
            const totalVideos = allVideos.length
            const watchedCount = Object.values(watchedVideos).filter(Boolean).length
            const progress = totalVideos > 0 ? (watchedCount / totalVideos) * 100 : 0

            const nextUnwatchedVideo =
                allVideos.find((video) => !watchedVideos[video.videoId]) || null

            return {
                id: course.id,
                name: course.name,
                courseId: content.courseId, // Keep this if needed for other purposes
                courseTitle: content.courseTitle,
                courseDescription: content.courseDescription,
                coursePreview: content.coursePreview,
                progress,
                nextUnwatchedVideo,
                content: content,
            }
        })

        return processedCourses
    } catch (error) {
        console.error('Error fetching user courses:', error)
        throw error
    }
}


export async function getAllCourses(
    userId: string,
): Promise<ProcessedCourse[]> {
    const supabase = await createClient()

    try {
        // Fetch user courses
        const { data: userCourses, error: userCoursesError } = await supabase
            .from('user_courses')
            .select('*')
            .eq('user_id', userId)
        console.log('userCourses', userCourses)
        if (userCoursesError) throw userCoursesError
        const userCourseIds = userCourses.map((uc) => uc.course_id);

        // Fetch course details
        const { data: allCourses, error: coursesError } = (await supabase
            .from('courses')
            .select('*')
        ) as { data: DatabaseCourse[]; error: any }
        const courses = allCourses.filter(course => !userCourseIds.includes(course.id));

        console.log("course all filtered=>", courses, userCourseIds)
        if (coursesError) throw coursesError

        // Process courses
        const processedCourses = courses.map((course: DatabaseCourse) => {

            const content: CourseContent =
                typeof course.content === 'string'
                    ? (JSON.parse(course.content) as CourseContent)
                    : (course.content as CourseContent)

            return {
                id: course.id,
                name: course.name,
                courseId: content.courseId, // Keep this if needed for other purposes
                courseTitle: content.courseTitle,
                courseDescription: content.courseDescription,
                coursePreview: content.coursePreview,
                progress: null,
                nextUnwatchedVideo: null,
                content: content,
            }
        })

        return processedCourses
    } catch (error) {
        console.error('Error fetching user courses:', error)
        throw error
    }
}


export async function addCourseToUserCourses(
    userId: string,
    courseId: string
): Promise<void> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('user_courses')
            .insert([
                { user_id: userId, course_id: courseId }
            ]);

        if (error) {
            console.error('Error adding course to user_courses:', error);
            throw error;
        }

        console.log(`Course ${courseId} added to user_courses for user ${userId}`);
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
}


export async function removeCourseFromUserCourses(
    userId: string,
    courseId: string
): Promise<void> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('user_courses')
            .delete()
            .eq('user_id', userId)
            .eq('course_id', courseId);

        if (error) {
            console.error('Error removing course from user_courses:', error);
            throw error;
        }

        console.log(`Course ${courseId} removed from user_courses for user ${userId}`);
    } catch (error) {
        console.error('Error removing course:', error);
        throw error;
    }
}
