import React, { useState } from 'react'
import { useAnalytics } from '@/lib/hooks/use-analytics'
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface OptInProps {
  buttonLink?: string | null
  buttonText?: string | null
  title?: string | null
  description?: string | null
  referral?: string | null
  files?: any | null
  emailTemplateName?: string | null
  headingStyles?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: string
  }
  textStyles?: {
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: string
  }
  buttonStyles?: {
    backgroundColor?: string
    textColor?: string
    hoverBackgroundColor?: string
    activeBackgroundColor?: string
    padding?: string
    borderRadius?: string
    width?: string
    height?: string
    fontSize?: string
    iconWidth?: string
  }
}

interface FileAttributes {
  name: string
  url: string
  mime: string
}

interface File {
  attributes: FileAttributes
}

const OptInComponent: React.FC<OptInProps> = ({
  buttonLink = '#',
  buttonText = '',
  title = '',
  description = '',
  referral = '',
  files = [],
  emailTemplateName = 'optInSuccess',
  textStyles = {},
  headingStyles = {},
  buttonStyles = {},
}) => {
  const { trackEvent } = useAnalytics()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async () => {
    trackEvent('submit_optin', 'OptInComponent', email)
    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/user-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          current_url: window.location.href,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const attachments = files?.data?.map((file: File) => ({
          filename: file.attributes.name,
          path: file.attributes.url,
          type: file.attributes.mime,
        }))
        const sendOptinEmail = await fetch(`/api/email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            templateName: emailTemplateName,
            templateData: {
              name: email,
              formLink: `${process.env.NEXT_PUBLIC_BASE_URL}/signup?referralCode=${referral}`,
              subject: 'You are In! Access Your Personalized Resources Now',
              message: '',
              attachments: attachments,
            },
          }),
        })

        if (sendOptinEmail.ok) {
          setEmail('')
          alert('Form submitted successfully')
        } else {
          console.log('email Error', sendOptinEmail)
        }
      } else {
        console.error('Error submitting form:', response.statusText)
        alert('Error submitting form')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert('An error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  const headingStyle: React.CSSProperties = {
    color: headingStyles?.color || 'white',
    fontSize: headingStyles?.fontSize || '3rem',
    fontWeight: headingStyles?.fontWeight || 'bold',
    textAlign:
      (headingStyles?.textAlign as React.CSSProperties['textAlign']) ||
      'center',
  }
  const buttonStyle: React.CSSProperties = {
    backgroundColor: buttonStyles?.backgroundColor || '#f0c14b',
    color: buttonStyles?.textColor || '#000',
    padding: buttonStyles?.padding || '1rem 2rem',
    borderRadius: buttonStyles?.borderRadius || '8px',
    width: buttonStyles?.width || 'auto',
    height: buttonStyles?.height || '50px',
    fontSize: buttonStyles?.fontSize || '16px',
  }

  const textStyle: React.CSSProperties = {
    color: textStyles?.color || 'white',
    fontSize: textStyles?.fontSize || '1rem',
    fontWeight: textStyles?.fontWeight || 'normal',
    textAlign:
      (textStyles?.textAlign as React.CSSProperties['textAlign']) || 'center',
  }

  return (
    <div className="bg-teal-600 text-white py-12">
      <h2
        className="container text-2xl sm:text-3xl text-center font-bold font-lexendDeca mb-5"
        style={headingStyle}
      >
        {title}
      </h2>
      <h4
        className="container text-lg sm:text-xl text-center font-normal font-lexendDeca mb-5"
        style={textStyle}
      >
        {description}
      </h4>
      <div className="w-full sm:w-1/2 md:w-3/4 flex justify-center mb-5 mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`p-3 text-black rounded-lg md:w-1/2 ${
            error ? 'border-2 border-red-500' : 'border'
          } `}
        />
      </div>
      {error && <div className="text-red-500 text-center mb-3">{error}</div>}
      <div className="w-full flex justify-center z-20">
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={buttonStyle}
          className={`group cta-button text-xl sm:text-3xl relative z-20 flex text-center justify-center items-center font-bold text-black bg-navyYellow hover:bg-[#b89323] active:bg-[#7e6419] px-7 py-1 sm:py-3 transition duration-300 shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_2px_#c3c3c3] hover:shadow-[0px_0px_0px_4px_#e6b00f,_0px_0px_0px_12px_#b3b3b3] active:shadow-[0px_0px_0px_2px_#e6b00f,_0px_0px_0px_5px_#b3b3b3] rounded ${
            loading ? 'opacity-50' : ''
          }`}
        >
          {loading ? 'Submitting...' : buttonText}
          <span className="inline-flex items-center justify-center p-2.5 px-2.5 ml-2 transition-transform duration-300 group-hover:translate-x-6">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="text-black w-9 h-9"
              style={{
                color: buttonStyles?.textColor || '#000',
                width: buttonStyles?.iconWidth || '20px',
              }}
            />
          </span>
        </button>
      </div>
    </div>
  )
}

export default OptInComponent
