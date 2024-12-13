import { Separator } from "@/components/ui/separator"
import CustomerPortalForm from "@/components/AccountForms/CustomerPortalForm"
import { createClient } from "@/utils/supabase/client";
import CourseModule from "@/components/courses/courseModule";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function PurchasesPage() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

    
    const courseTitle = "Introduction to Programming";
    const courseDescription = "Begin your programming journey with the basics of coding.";
    const courseId = "course_001";
    const videos = [
      {
        title: "Variables and Data Types",
        videoId: "546130814",
        description: "Learn about variables and the different types of data you can manipulate.",
        watched: true
      },
      {
        title: "Getting Started with Programming",
        videoId: "448155181",
        description: "An introduction to the fundamental concepts of programming.",
        watched: false
      },
      {
        title: "Variables and Data Types",
        videoId: "546130814",
        description: "Learn about variables and the different types of data you can manipulate.",
        watched: false
      },
      {
        title: "Introduction to HTML",
        videoId: "34567890",
        description: "Learn the basics of HTML and start building your first webpage.",
        watched: false
      },
      {
        title: "Styling with CSS",
        videoId: "924822617",
        description: "Discover how to make your websites look beautiful using CSS.",
        watched: false
      },
      {
        title: "Introduction to HTML",
        videoId: "34567890",
        description: "Learn the basics of HTML and start building your first webpage.",
        watched: false
      }
    ]
    

  return (
    
      
        <CourseModule title={courseTitle} description={courseDescription} videos={videos} />
      
      
  )
}
