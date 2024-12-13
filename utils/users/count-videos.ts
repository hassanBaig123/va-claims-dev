export function countVideos(course: any): number {
    return course?.content?.modules?.reduce(
        (total: any, module: any) => (total += module?.videos?.length),
        0,
    )
}