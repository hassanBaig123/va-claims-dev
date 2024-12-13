'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MultiSelect } from '@/components/intake/Multiselect'
import {
  addCourseToUserCourses,
  getAllCourses,
} from '@/utils/users/user-courses'

const supabase = createClient()

const AddCourseDialog = ({
  children,
  userId,
  refreshData,
}: {
  children: any
  userId: string
  refreshData: any
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      setError('')
      const data = await getAllCourses(userId)
      if (data) {
        setCourses(data.map((course) => `${course.name}`))
        setAllCourses(data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Unexpected error occurred.')
    }
  }

  const handleAddCourses = async () => {
    setLoading(true)
    setError(null)

    const courseIds = allCourses
      .filter((course) => selectedCourses.includes(course.name))
      .map((course) => course.id)

    try {
      for (const courseId of courseIds) {
        await addCourseToUserCourses(userId, courseId)
      }
      setSelectedCourses([])
      setIsOpen(false)
      fetchCourses()
      if (refreshData) {
        refreshData()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Unexpected error occurred while adding courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [isOpen])

  return (
    <>
      {/* Trigger Button */}
      <div onClick={() => setIsOpen(true)}>{children}</div>

      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[525px] p-0">
          <DialogHeader className="bg-primary/5 p-4 rounded-t-lg">
            <DialogTitle className="text-xl font-normal text-foreground">
              Select Course
            </DialogTitle>
          </DialogHeader>

          {courses.length > 0 ? (
            <div className="px-6 py-4 space-y-4">
              {error && <p className="text-red-500">{error}</p>}

              {/* MultiSelect Component */}
              {courses.length === 0 ? (
                <p className="text-gray-500">No available courses to add</p>
              ) : (
                <>
                  {/* MultiSelect Component */}
                  <MultiSelect
                    options={courses}
                    value={selectedCourses}
                    onChange={setSelectedCourses}
                    placeholder="course"
                  />
                </>
              )}

              {/* Action Buttons */}
              {courses.length > 0 && (
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className=" text-black font-normal rounded-lg px-4 py-2"
                    variant={'outline'}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCourses}
                    className={`rounded-lg px-4 py-2`}
                    disabled={loading || selectedCourses.length === 0}
                    variant={'black'}
                  >
                    {loading ? 'Adding...' : 'Add Courses'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              <p className="text-gray-500">No available courses to add</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddCourseDialog
