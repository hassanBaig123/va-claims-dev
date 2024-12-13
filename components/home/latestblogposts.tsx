import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

export default function BlogList() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight ">Latest News and Articles</h2>
        <div className="mt-6 grid gap-16 lg:grid-cols-4">
          <Card className="col-span-1">
            <CardContent className="aspect-w-3 aspect-h-2 relative">
              <Image
                alt=""
                src="/imgs/placeholder.svg"
                layout="fill"
                objectFit="cover"
                className="rounded-lg mt-4"
              />
            </CardContent>
            <CardHeader>
              <CardTitle className="text-lg font-medium leading-6 ">The Future of AI</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 text-base ">
              This article explores the future of AI and its potential impact on society and the economy.
            </CardContent>
            <CardFooter>
              <Link className="text-base font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                Read More →
              </Link>
            </CardFooter>
          </Card>
          <Card className="col-span-1">
            <CardContent className="aspect-w-3 aspect-h-2 relative">
              <Image
                alt=""
                src="/imgs/placeholder.svg"
                layout="fill"
                objectFit="cover"
                className="rounded-lg mt-4"
              />
            </CardContent>
            <CardHeader>
              <CardTitle className="text-lg font-medium leading-6 ">The Future of AI</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 text-base ">
              This article explores the future of AI and its potential impact on society and the economy.
            </CardContent>
            <CardFooter>
              <Link className="text-base font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                Read More →
              </Link>
            </CardFooter>
          </Card>
          <Card className="col-span-1">
            <CardContent className="aspect-w-3 aspect-h-2 relative">
              <Image
                alt=""
                src="/imgs/placeholder.svg"
                layout="fill"
                objectFit="cover"
                className="rounded-lg mt-4"
              />
            </CardContent>
            <CardHeader>
              <CardTitle className="text-lg font-medium leading-6 ">Hydrogen-Powered Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="mt-2 text-base ">
              This article delves into the cutting-edge technology behind hydrogen fuel cells and their environmental
              benefits.
            </CardContent>
            <CardFooter>
              <Link className="text-base font-semibold text-indigo-600 hover:text-indigo-500" href="#">
                Read More →
              </Link>
            </CardFooter>
          </Card>
          <div className="bg-black text-white rounded-lg shadow-lg col-span-1">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Discover all my articles</h3>
              <p className="mt-4 text-base">I am a versatile writer who explores a wide range of genres and topics.</p>
              <div className="mt-6">
                <a className="text-base font-semibold text-indigo-400 hover:text-indigo-300" href="#">
                  View More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}