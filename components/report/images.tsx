import Image from 'next/image'
import React from 'react'

interface ImageProps {
  imagePath: string
  altText?: string
  width: number
  height: number
}

const DisplayImage: React.FC<ImageProps> = ({
  imagePath,
  altText = 'Image',
  width,
  height,
}) => {
  return (
    <Image
      src={imagePath}
      alt={altText}
      layout="fixed"
      width={width || 120}
      height={height || 120}
    />
  )
}

export default DisplayImage
