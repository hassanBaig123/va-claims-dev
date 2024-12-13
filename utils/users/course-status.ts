export function getCourseStatus(progress: number) {
    if (progress === 0) {
        return 'Not Started'
    } else if (progress > 0 && progress < 100) {
        return 'In Progress'
    } else if (progress === 100) {
        return 'Completed'
    } else {
        return 'Invalid progress value'
    }
}
