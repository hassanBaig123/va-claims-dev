import React from 'react'
import Image from 'next/image'

interface BlogImageProps {
  className?: string
  src: string
  alt: string
  fill?: boolean
  priority?: boolean
  height?: number
  width?: number
  style?: React.CSSProperties
  onClick?: () => void
}

const BlogImage: React.FC<BlogImageProps> = ({
  className,
  src,
  alt,
  fill,
  priority,
  style,
  onClick,
  height,
  width,
}) => {
  return (
    <div
      className={`mt-6 relative flex justify-center items-center ${className}`} // Tailwind flexbox for centering
      onClick={onClick}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        className="object-cover rounded" // Tailwind classes for image styling
      />
    </div>
  )
}

export default BlogImage
