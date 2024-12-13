'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlogPage() {
  const router = useRouter()
  const [blogPosts, setBlogPosts] = useState([])

  const getAllBlogs = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate=featuredImage,categories,tags,metadata.image,author.image`,
    )

    const blogsList = data.data?.map((blog: any) => {
      const featuredImage =
        blog?.attributes?.featuredImage?.data?.attributes?.url || ''
      const featuredImageHeight =
        blog?.attributes?.featuredImage?.data?.attributes?.height || ''
      const featuredImageWidth =
        blog?.attributes?.featuredImage?.data?.attributes?.width || ''

      const description = blog?.attributes?.description || []

      // Formatting the description into a single text
      const formattedDescription = description
        .map((desc: any) =>
          desc.children.map((child: any) => child.text).join(''),
        )
        .join('\n\n')

      // Handle categories and tags
      const categories =
        blog?.attributes?.categories?.data?.map((category: any) => ({
          name: category?.attributes?.name || '',
          id: category?.id || '',
          backgroundColor: category?.attributes?.color || '', // Adjust based on the API response
        })) || []

      const tags =
        blog?.attributes?.tags?.data?.map((tag: any) => ({
          name: tag?.attributes?.name || '',
          id: tag?.id || '',
        })) || []

      const truncateDescription = (description: string) => {
        const words = description.split(' ')
        if (words.length > 20) {
          return words.slice(0, 15).join(' ') + '...'
        }
        return description
      }

      const metaDescription = blog?.attributes?.metadata?.metaDescription || ''
      const truncatedDescription = truncateDescription(metaDescription)

      return {
        id: blog?.id,
        title: blog?.attributes?.title || '',
        slug: blog?.attributes?.slug || '',
        shortDescription: truncatedDescription || '', // Update according to your needs
        description: formattedDescription,
        featuredImage: featuredImage
          ? featuredImage
          : '/imgs/expert-course-image.jpg',
        featuredImageHeight: featuredImageHeight,
        featuredImageWidth: featuredImageWidth,
        timeRequiredToReadTheBlog: blog?.attributes?.timeRequiredToReadTheBlog
          ? `${blog?.attributes?.timeRequiredToReadTheBlog} min read`
          : '',
        createdAt: blog?.attributes?.createdAt,
        updatedAt: blog?.attributes?.updatedAt,
        categories,
        tags,
        permalink: blog?.attributes?.slug || '',
        isTrending: blog?.attributes?.isTrending || false,
        dynamicMetaData: blog?.attributes?.metadata,
        textDescription: blog?.attributes?.textDescription || '',
      }
    })

    setBlogPosts(blogsList || [])
  }

  // Fetch the blogs when the component mounts
  useEffect(() => {
    getAllBlogs()
  }, [])

  return (
    <>
      <h1 className="w-full text-center text-4xl font-extrabold text-gray-900 my-4 mt-40">
        Veterans VA Claims Blogs
      </h1>

      <div className="flex justify-center my-6 px-4">
        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center w-full max-w-[80vw]">
          {blogPosts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No Blog posts currently available.
            </p>
          ) : (
            <>
              {blogPosts.map((post: any) => (
                <article
                  key={post.id}
                  onClick={() => router.push(`/blog/${post.slug}`)}
                  className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:bg-gray-100 hover:shadow-xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={post.title}
                    src={post?.featuredImage}
                    className="w-full h-60 object-cover"
                  />

                  {/* Blog Content */}
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {post.title}
                    </h2>
                    <div className="text-gray-600 mb-4">
                      {post.shortDescription}
                    </div>

                    <a
                      href={`/blog/${post.slug}`}
                      className="text-blue-500 hover:underline inline-block mt-auto"
                    >
                      Read more
                    </a>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}
