import { Metadata } from 'next'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'
import { CourseSidebarNav } from '@/components/courses/courseSidebar'

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
}

const courseSidebarNavItems = [
  {
    title: 'Introduction to Programming',
    description: 'Begin your programming journey with the basics of coding.',
    courseId: 'course_001',
    videos: [
      {
        title: 'Getting Started with Programming',
        videoId: '12345678',
        description:
          'An introduction to the fundamental concepts of programming.',
        watched: true,
      },
      {
        title: 'Variables and Data Types',
        videoId: '23456789',
        description:
          'Learn about variables and the different types of data you can manipulate.',
        watched: true,
      },
      {
        title: 'Introduction to HTML',
        videoId: '34567890',
        description:
          'Learn the basics of HTML and start building your first webpage.',
        watched: false,
      },
      {
        title: 'Styling with CSS',
        videoId: '45678901',
        description:
          'Discover how to make your websites look beautiful using CSS.',
        watched: false,
      },
    ],
  },
  {
    title: 'Web Development Fundamentals',
    description:
      'Dive into the world of web development with this comprehensive course.',
    courseId: 'course_002',
    videos: [
      {
        title: 'Introduction to HTML',
        videoId: '34567890',
        description:
          'Learn the basics of HTML and start building your first webpage.',
        watched: false,
      },
      {
        title: 'Styling with CSS',
        videoId: '45678901',
        description:
          'Discover how to make your websites look beautiful using CSS.',
        watched: false,
      },
    ],
  },
  {
    title: 'Advanced JavaScript',
    description:
      'Take your JavaScript skills to the next level with advanced concepts and techniques.',
    courseId: 'course_003',
    videos: [
      {
        title: 'Asynchronous JavaScript',
        videoId: '56789012',
        description:
          'Understand the asynchronous nature of JavaScript with callbacks, promises, and async/await.',
        watched: false,
      },
      {
        title: 'JavaScript Frameworks',
        videoId: '67890123',
        description:
          'An overview of popular JavaScript frameworks and their use cases.',
        watched: false,
      },
    ],
  },
  {
    title: 'React for Beginners',
    description:
      'Learn the fundamentals of React and start building interactive UIs.',
    courseId: 'course_004',
    videos: [
      {
        title: 'Getting Started with React',
        videoId: '78901234',
        description:
          "A beginner's guide to understanding the core concepts of React.",
        watched: false,
      },
      {
        title: 'React Components',
        videoId: '89012345',
        description:
          'Learn about React components and how to use them to build complex UIs.',
        watched: false,
      },
    ],
  },
  {
    title: 'Node.js Essentials',
    description:
      'Explore the backend with Node.js and build scalable network applications.',
    courseId: 'course_005',
    videos: [
      {
        title: 'Introduction to Node.js',
        videoId: '90123456',
        description: 'What is Node.js and why use it for your backend?',
        watched: false,
      },
      {
        title: 'Working with Express',
        videoId: '01234567',
        description:
          'Learn to use Express.js to simplify your Node.js server code.',
        watched: false,
      },
    ],
  },
  {
    title: 'Python Programming',
    description:
      'Master Python and its versatile applications from web development to data analysis.',
    courseId: 'course_006',
    videos: [
      {
        title: 'Python Basics',
        videoId: '11223344',
        description: 'An introduction to Python and its syntax.',
        watched: false,
      },
      {
        title: 'Data Structures in Python',
        videoId: '22334455',
        description:
          'Understanding lists, dictionaries, sets, and tuples in Python.',
        watched: false,
      },
    ],
  },
  {
    title: 'Data Science with Python',
    description:
      'Dive into data science and machine learning with Python as your tool.',
    courseId: 'course_007',
    videos: [
      {
        title: 'Introduction to Data Science',
        videoId: '33445566',
        description: 'What is data science and what does a data scientist do?',
        watched: false,
      },
      {
        title: 'Machine Learning Basics',
        videoId: '44556677',
        description: 'An overview of machine learning and its applications.',
        watched: false,
      },
    ],
  },
  {
    title: 'Full Stack Development',
    description:
      'Become a full-stack developer by learning both front-end and back-end technologies.',
    courseId: 'course_008',
    videos: [
      {
        title: 'Front-end Technologies',
        videoId: '55667788',
        description:
          'An overview of the technologies used in front-end development.',
        watched: false,
      },
      {
        title: 'Back-end Technologies',
        videoId: '66778899',
        description:
          'Learn about the technologies that power the server side of web applications.',
        watched: false,
      },
    ],
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <CourseSidebarNav />
          </aside>
          {children}
        </div>
      </div>
    </>
  )
}
