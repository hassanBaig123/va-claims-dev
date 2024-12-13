import React, { useState, useEffect } from 'react'

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const [message, setMessage] = useState<any>('')
  const [isFinished, setIsFinished] = useState<boolean>(false)

  const blackFridayDate = new Date('2024-12-01T23:59:59')
  const isBlackFridayYetToPass = (now: Date) => {
    return now < blackFridayDate
  }

  useEffect(() => {
    const priceIncreaseDate = new Date('2024-10-22T23:59:59')

    const getNextSaturday = () => {
      const now = new Date()
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7
      const nextSaturday = new Date(
        now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000,
      )
      nextSaturday.setHours(23, 59, 59, 0)
      return nextSaturday
    }

    const timer = setInterval(() => {
      const now = new Date()
      let targetDate: Date
      let currentMessage: any

      if (isBlackFridayYetToPass(now)) {
        targetDate = blackFridayDate
        currentMessage =
          'Bonus Intro 1-on-1 Call With Jordan Included With Any Package!\nThis Black Friday Promotion Ends In!'
      } else if (now < priceIncreaseDate) {
        targetDate = priceIncreaseDate
        currentMessage = 'Price Increase In:'
      } else {
        targetDate = getNextSaturday()
        currentMessage = 'Enrollment Group Closes In:'
      }

      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
        setMessage(currentMessage)
      } else {
        clearInterval(timer)
        setIsFinished(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (isFinished) {
    return null
  }

  return (
    <div className="w-full text-oxfordBlue py-4 sm:py-8 px-2 sm:px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-red-600 animate-pulse whitespace-pre-line">
          {message}
        </h2>
        <div className="flex justify-center items-center space-x-2 sm:space-x-6">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' },
          ].map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-5xl font-bold text-red-700 transition-all duration-300 ease-in-out transform hover:scale-110">
                  {item.value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs sm:text-sm uppercase mt-1 sm:mt-2 font-semibold">
                  {item.label}
                </span>
              </div>
              {index < 3 && (
                <div className="text-2xl sm:text-4xl font-bold text-red-400">
                  :
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Countdown
