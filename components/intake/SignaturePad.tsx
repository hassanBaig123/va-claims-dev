'use client'
import React, { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'

const Signature: any = SignatureCanvas

type SignaturePadProps = {
  onEnd?: (signature: string) => void // Callback function to handle the end of the signing
}

export const SignaturePad = ({ onEnd }: SignaturePadProps) => {
  const sigPadRef = useRef<SignatureCanvas>(null)

  const handleEnd = () => {
    if (sigPadRef.current) {
      const signatureImage = sigPadRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png')
      onEnd?.(signatureImage)
    }
  }

  return (
    <Signature
      ref={sigPadRef}
      penColor="black"
      onEnd={handleEnd}
      canvasProps={{ className: 'signatureCanvas' }}
    />
  )
}
