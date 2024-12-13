// import React, { useEffect } from 'react'
// import { TermsCheck } from '../learn-more/StripePaymentForm'
// import { Product } from '../learn-more/pricing'

// interface ContactInformationProps {
//   userData: any
//   stripe: any
//   elements: any
//   CardElement: any
//   paymentMethod: string
//   firstName: string
//   lastName: string
//   email: string
//   street: string
//   phone: string
//   city: string
//   state: string
//   zip: string
//   errors: Record<string, string>
//   agreedToTerms: boolean
//   setFirstName: React.Dispatch<React.SetStateAction<string>>
//   setLastName: React.Dispatch<React.SetStateAction<string>>
//   setEmail: React.Dispatch<React.SetStateAction<string>>
//   setStreet: React.Dispatch<React.SetStateAction<string>>
//   setPhone: React.Dispatch<React.SetStateAction<string>>
//   setCity: React.Dispatch<React.SetStateAction<string>>
//   setState: React.Dispatch<React.SetStateAction<string>>
//   setZip: React.Dispatch<React.SetStateAction<string>>
//   setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
//   setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>
//   setIsComplete: React.Dispatch<React.SetStateAction<boolean>>
//   setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>
// }

// const ContactInformation: React.FC<ContactInformationProps> = ({
//   userData,
//   CardElement,
//   paymentMethod,
//   firstName,
//   lastName,
//   email,
//   street,
//   phone,
//   city,
//   state,
//   zip,
//   errors,
//   agreedToTerms,
//   setFirstName,
//   setLastName,
//   setEmail,
//   setStreet,
//   setPhone,
//   setCity,
//   setState,
//   setZip,
//   setErrors,
//   setIsComplete,
//   setIsFormValid,
//   setAgreedToTerms,
// }) => {
//   console.log(userData, 'in form')
//   const isCardPayment =
//     paymentMethod === 'card' || paymentMethod === 'installments'

//   const handleChange = (event: any) => {
//     setIsComplete(event.complete)
//   }

//   useEffect(() => {
//     const allFieldsFilled =
//       [firstName, lastName, email, street, city, state, zip, phone].every(
//         (field) => field.trim() !== '',
//       ) && agreedToTerms
//     setIsFormValid(allFieldsFilled)
//   }, [
//     firstName,
//     lastName,
//     email,
//     street,
//     city,
//     state,
//     zip,
//     phone,
//     agreedToTerms,
//   ])

//   const handleInputChange =
//     (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setter(e.target.value)
//       setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
//     }

//   return (
//     <div>
//       <div className="my-8">
//         <TermsCheck
//           {...{
//             errors,
//             setErrors,
//             agreedToTerms,
//             setAgreedToTerms,
//           }}
//         />
//       </div>
//       <h4 className="text-oxfordBlue font-semibold text-lg">
//         Contact Information
//       </h4>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
//         <div>
//           <label className="block text-[#161618] ">First Name *</label>
//           <input
//             type="text"
//             placeholder="First Name *"
//             value={firstName}
//             onChange={handleInputChange(setFirstName, 'firstName')}
//             className="w-full px-3 py-2 border border-gray-300 rounded"
//           />
//           <FieldError {...{ errorMessage: errors?.firstName }} />
//         </div>
//         <div>
//           <label className="block text-[#161618] ">Last Name *</label>
//           <input
//             type="text"
//             value={lastName}
//             placeholder="Last Name *"
//             onChange={handleInputChange(setLastName, 'lastName')}
//             className="w-full px-3 py-2 border border-gray-300 rounded"
//           />
//           <FieldError {...{ errorMessage: errors?.lastName }} />
//         </div>
//       </div>

//       <div className="mt-4">
//         <label className="block text-[#161618] ">Email Address *</label>
//         <input
//           type="email"
//           placeholder="Email Address *"
//           value={email}
//           onChange={handleInputChange(setEmail, 'email')}
//           className="w-full px-3 py-2 border border-gray-300 rounded"
//         />
//         <FieldError {...{ errorMessage: errors?.email }} />
//       </div>

//       <div className="mt-4">
//         <label className="block text-[#161618] ">Street Address *</label>
//         <input
//           type="text"
//           placeholder="Street Address *"
//           value={street}
//           onChange={handleInputChange(setStreet, 'street')}
//           className="w-full px-3 py-2 border border-gray-300 rounded"
//         />
//         <FieldError {...{ errorMessage: errors?.street }} />
//       </div>

//       <div className="mt-4">
//         <label className="block text-[#161618] ">Phone Number *</label>
//         <input
//           type="tel"
//           value={phone}
//           placeholder="Phone Number *"
//           onChange={handleInputChange(setPhone, 'phone')}
//           className="w-full px-3 py-2 border border-gray-300 rounded"
//         />
//         <FieldError {...{ errorMessage: errors?.phone }} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
//         <div>
//           <label className="block text-[#161618] ">City *</label>
//           <input
//             type="text"
//             value={city}
//             placeholder="City *"
//             onChange={handleInputChange(setCity, 'city')}
//             className="w-full px-3 py-2 border border-gray-300 rounded"
//           />
//           <FieldError {...{ errorMessage: errors?.city }} />
//         </div>
//         <div>
//           <label className="block text-[#161618] ">State *</label>
//           <input
//             type="text"
//             value={state}
//             placeholder="State *"
//             onChange={handleInputChange(setState, 'state')}
//             className="w-full px-3 py-2 border border-gray-300 rounded"
//           />
//           <FieldError {...{ errorMessage: errors?.state }} />
//         </div>
//         <div>
//           <label className="block text-[#161618] ">Zip Code *</label>
//           <input
//             type="text"
//             placeholder="Zip Code *"
//             value={zip}
//             onChange={handleInputChange(setZip, 'zip')}
//             className="w-full px-3 py-2 border border-gray-300 rounded"
//           />
//           <FieldError {...{ errorMessage: errors?.zip }} />
//         </div>
//       </div>

//       {isCardPayment && (
//         <div className="my-4">
//           <label
//             htmlFor="card-element"
//             className="block text-sm font-medium text-[#161618]  mb-2"
//           >
//             Credit or debit card
//           </label>
//           <div id="card-element" className="p-2 border rounded">
//             <CardElement
//               onChange={handleChange}
//               options={{ style: { base: { fontSize: '14px' } } }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default ContactInformation

// interface FieldErrorProps {
//   errorMessage: string
// }

// const FieldError: React.FC<FieldErrorProps> = ({ errorMessage }) => (
//   <>
//     {errorMessage && (
//       <p style={{ fontWeight: 500 }} className="text-red-500 text-xs mt-1">
//         {errorMessage}
//       </p>
//     )}
//   </>
// )

import React, { useEffect } from 'react'
import { TermsCheck } from '../learn-more/StripePaymentForm'
import { Product } from '../learn-more/pricing'

interface ContactInformationProps {
  userData: any
  stripe: any
  elements: any
  CardElement: any
  paymentMethod: string
  firstName: string
  lastName: string
  email: string
  street: string
  phone: string
  city: string
  state: string
  zip: string
  errors: Record<string, string>
  agreedToTerms: boolean
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  setLastName: React.Dispatch<React.SetStateAction<string>>
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setStreet: React.Dispatch<React.SetStateAction<string>>
  setPhone: React.Dispatch<React.SetStateAction<string>>
  setCity: React.Dispatch<React.SetStateAction<string>>
  setState: React.Dispatch<React.SetStateAction<string>>
  setZip: React.Dispatch<React.SetStateAction<string>>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>
  setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>
}

const ContactInformation: React.FC<ContactInformationProps> = ({
  userData,
  CardElement,
  paymentMethod,
  firstName,
  lastName,
  email,
  street,
  phone,
  city,
  state,
  zip,
  errors,
  agreedToTerms,
  setFirstName,
  setLastName,
  setEmail,
  setStreet,
  setPhone,
  setCity,
  setState,
  setZip,
  setErrors,
  setIsComplete,
  setIsFormValid,
  setAgreedToTerms,
}) => {
  // Prefill form fields when userData exists
  useEffect(() => {
    if (userData) {
      if (userData.full_name) {
        const [userFirstName, ...lastNameParts] = userData.full_name.split(' ')
        setFirstName(userFirstName)
        setLastName(lastNameParts.join(' '))
      }

      if (userData.email) {
        setEmail(userData.email)
      }

      console.log(userData, 'in form')

      if (userData.billing_address) {
        const address =
          typeof userData.billing_address === 'string'
            ? JSON.parse(userData.billing_address)
            : userData.billing_address
        setStreet(address?.street || '')
        setCity(address?.city || '')
        setState(address?.state || '')
        setZip(address?.zip || '')
        setPhone(address?.phone || '')
      }
    }
  }, [userData])

  const isCardPayment =
    paymentMethod === 'card' || paymentMethod === 'installments'

  const handleChange = (event: any) => {
    setIsComplete(event.complete)
  }

  useEffect(() => {
    const allFieldsFilled =
      [firstName, lastName, email, street, city, state, zip, phone].every(
        (field) => field.trim() !== '',
      ) && agreedToTerms
    setIsFormValid(allFieldsFilled)
  }, [
    firstName,
    lastName,
    email,
    street,
    city,
    state,
    zip,
    phone,
    agreedToTerms,
  ])

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    }

  return (
    <div>
      <div className="my-8">
        <TermsCheck
          {...{
            errors,
            setErrors,
            agreedToTerms,
            setAgreedToTerms,
          }}
        />
      </div>
      <h4 className="text-oxfordBlue font-semibold text-lg">
        Contact Information
      </h4>
      {!userData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-[#161618] ">First Name *</label>
            <input
              type="text"
              placeholder="First Name *"
              value={firstName}
              onChange={handleInputChange(setFirstName, 'firstName')}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <FieldError {...{ errorMessage: errors?.firstName }} />
          </div>
          <div>
            <label className="block text-[#161618] ">Last Name *</label>
            <input
              type="text"
              value={lastName}
              placeholder="Last Name *"
              onChange={handleInputChange(setLastName, 'lastName')}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <FieldError {...{ errorMessage: errors?.lastName }} />
          </div>
        </div>
      )}

      {!userData && (
        <div className="mt-4">
          <label className="block text-[#161618] ">Email Address *</label>
          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            disabled={userData?.email ? true : false}
            onChange={handleInputChange(setEmail, 'email')}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <FieldError {...{ errorMessage: errors?.email }} />
        </div>
      )}

      <div className="mt-4">
        <label className="block text-[#161618] ">Street Address *</label>
        <input
          type="text"
          placeholder="Street Address *"
          value={street}
          onChange={handleInputChange(setStreet, 'street')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <FieldError {...{ errorMessage: errors?.street }} />
      </div>

      <div className="mt-4">
        <label className="block text-[#161618] ">Phone Number *</label>
        <input
          type="tel"
          value={phone}
          placeholder="Phone Number *"
          onChange={handleInputChange(setPhone, 'phone')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        <FieldError {...{ errorMessage: errors?.phone }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-[#161618] ">City *</label>
          <input
            type="text"
            value={city}
            placeholder="City *"
            onChange={handleInputChange(setCity, 'city')}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <FieldError {...{ errorMessage: errors?.city }} />
        </div>
        <div>
          <label className="block text-[#161618] ">State *</label>
          <input
            type="text"
            value={state}
            placeholder="State *"
            onChange={handleInputChange(setState, 'state')}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <FieldError {...{ errorMessage: errors?.state }} />
        </div>
        <div>
          <label className="block text-[#161618] ">Zip Code *</label>
          <input
            type="text"
            placeholder="Zip Code *"
            value={zip}
            onChange={handleInputChange(setZip, 'zip')}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <FieldError {...{ errorMessage: errors?.zip }} />
        </div>
      </div>

      {isCardPayment && (
        <div className="my-4">
          <label
            htmlFor="card-element"
            className="block text-sm font-medium text-[#161618]  mb-2"
          >
            Credit or debit card
          </label>
          <div id="card-element" className="p-2 border rounded">
            <CardElement
              onChange={handleChange}
              options={{ style: { base: { fontSize: '14px' } } }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactInformation

interface FieldErrorProps {
  errorMessage: string
}

const FieldError: React.FC<FieldErrorProps> = ({ errorMessage }) => (
  <>
    {errorMessage && (
      <p style={{ fontWeight: 500 }} className="text-red-500 text-xs mt-1">
        {errorMessage}
      </p>
    )}
  </>
)
