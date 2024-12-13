'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import HtmlRender from '@/components/blog/html-render'

interface Category {
  name: string
  id: string
  backgroundColor: string
}

interface Tag {
  name: string
  id: string
}

interface DynamicMetaData {
  id: number
  metaTitle: string
  metaDescription: string
}

interface Blog {
  id: number
  title: string
  slug: string
  shortDescription: string
  description: string // Ensure this is a string
  featuredImage: string
  featuredImageHeight: number
  featuredImageWidth: number
  timeRequiredToReadTheBlog: string
  createdAt: string
  updatedAt: string
  categories: Category[]
  tags: Tag[]
  permalink: string
  isTrending: boolean
  dynamicMetaData: DynamicMetaData
  textDescription: string
  blogBanner: any
  optIn: any
  callToAction: any
}

const SingleBlog = () => {
  const router = useRouter()
  const { slug } = useParams()

  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    const fetchSingleBlog = async () => {
      if (!slug) return // Make sure slug is available

      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=featuredImage,categories,tags,metadata.image,author.image,blogBanner,blogBanner.backgroundImage,blogBanner.bannerContainerStyles,blogBanner.bannerContainerStyles.backgroundImage,blogBanner.headingStyle,blogBanner.buttonStyle,blogBanner.textStyle,optIn,optIn.files,optIn.textStyles,optIn.headingStyles,optIn.buttonStyles,callToAction,callToAction.headingStyles,callToAction.buttonStyles,
          `,
        )

        const blogData = data.data?.[0]

        if (blogData) {
          const featuredImage =
            blogData?.attributes?.featuredImage?.data?.attributes?.url || ''
          const featuredImageHeight =
            blogData?.attributes?.featuredImage?.data?.attributes?.height || 0
          const featuredImageWidth =
            blogData?.attributes?.featuredImage?.data?.attributes?.width || 0

          const description = blogData?.attributes?.description || '' // Ensure this is a string

          const categories =
            blogData?.attributes?.categories?.data?.map((category: any) => ({
              name: category?.attributes?.name || '',
              id: category?.id || '',
              backgroundColor: category?.attributes?.color || '',
            })) || []

          const tags =
            blogData?.attributes?.tags?.data?.map((tag: any) => ({
              name: tag?.attributes?.name || '',
              id: tag?.id || '',
            })) || []

          setBlog({
            id: blogData?.id,
            title: blogData?.attributes?.title || '',
            slug: blogData?.attributes?.slug || '',
            shortDescription:
              blogData?.attributes?.metadata?.metaDescription || '',
            description,
            featuredImage: featuredImage || '/imgs/expert-course-image.jpg',
            featuredImageHeight,
            featuredImageWidth,
            timeRequiredToReadTheBlog: blogData?.attributes
              ?.timeRequiredToReadTheBlog
              ? `${blogData?.attributes?.timeRequiredToReadTheBlog} min read`
              : 'No time estimate',
            createdAt: blogData?.attributes?.createdAt,
            updatedAt: blogData?.attributes?.updatedAt,
            categories,
            tags,
            permalink: blogData?.attributes?.slug || '',
            isTrending: blogData?.attributes?.isTrending || false,
            dynamicMetaData: blogData?.attributes?.metadata,
            textDescription: blogData?.attributes?.textDescription || '',
            blogBanner: blogData?.attributes?.blogBanner || '',
            optIn: blogData?.attributes?.optIn || '',
            callToAction: blogData?.attributes?.callToAction || '',
          })
        }
      } catch (error) {
        console.error('Error fetching blog:', error)
      }
    }

    if (slug) {
      fetchSingleBlog()
    }
  }, [slug])

  const mapDescriptionToHtml = (descriptionArray: any) => {
    return descriptionArray
      .map((block: any) => {
        if (block.type === 'paragraph') {
          return `<p>${block.children
            .map((child: any) => {
              if (child.type === 'text') {
                return child.text
              } else if (child.type === 'link') {
                return `<a href="${
                  child.url
                }" target="_blank" rel="noopener noreferrer">${child.children
                  .map((linkChild: any) => linkChild.text)
                  .join('')}</a>`
              }
              return ''
            })
            .join('')}</p>`
        }
        // Handle heading
        else if (block.type === 'heading') {
          return `<h${block.level}>${block.children
            .map((child: any) => child.text)
            .join('')}</h${block.level}>`
        }

        // Handle image
        else if (block.type === 'image' && block.image) {
          const { url, alternativeText, width, height } = block.image
          return `<img src="${url}" alt="${alternativeText}" width="${width}" height="${height}" />`
        }

        // Handle ordered list
        else if (block.type === 'list' && block.format === 'ordered') {
          const items = block.children
            .map((item: any) => {
              return `<li>${item.children
                .map((child: any) => {
                  if (child.type === 'text') {
                    return child.text
                  } else if (child.type === 'link') {
                    console.log('link on list::', child.url)
                    return `<a href="${child.url}">${child.children
                      .map((linkChild: any) => linkChild.text)
                      .join('')}</a>`
                  }
                  return ''
                })
                .join('')}</li>`
            })
            .join('')
          return `<ol>${items}</ol>`
        }

        // Handle unordered list
        else if (block.type === 'list' && block.format === 'unordered') {
          const items = block.children
            .map((item: any) => {
              return `<li>${item.children
                .map((child: any) => {
                  if (child.type === 'text') {
                    return child.text
                  } else if (child.type === 'link') {
                    return `<a href="${
                      child.url
                    }" target="_blank" rel="noopener noreferrer">${child.children
                      .map((linkChild: any) => linkChild.text)
                      .join('')}</a>`
                  }
                  return ''
                })
                .join('')}</li>`
            })
            .join('')
          return `<ul>${items}</ul>`
        }

        // Handle quote
        else if (block.type === 'quote') {
          return `<blockquote>${block.children
            .map((child: any) => child.text)
            .join('')}</blockquote>`
        }

        return ''
      })
      .join('') // Combine the resulting HTML strings
  }

  // Convert the description to HTML using the function
  const dynamicHtml = mapDescriptionToHtml(blog?.description || [])

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-5xl">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Upper Section */}
      <div className="w-full mb-20">
        {/* Colored Section */}
        <div className="bg-gray-200 h-[460px] flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-center text-gray-900">
            {blog?.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="flex justify-center items-center relative mx-auto w-full h-[400px] mt-[-150px] shadow-lg max-w-2xl rounded-lg">
          <Image
            src={blog?.featuredImage || '/imgs/expert-course-image.jpg'}
            alt="blog-featured-image"
            height={blog?.featuredImageHeight || 400}
            width={blog?.featuredImageWidth || 850}
            className="object-cover rounded-lg w-9/12 h-9/12 md:w-full md:h-full"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[70rem] mx-auto px-6 py-8">
        <HtmlRender
          content={dynamicHtml}
          blogBanner={blog?.blogBanner || []}
          optIn={blog?.optIn || []}
          callToAction={blog?.callToAction || []}
        />
      </div>
    </div>
  )
}

export default SingleBlog
