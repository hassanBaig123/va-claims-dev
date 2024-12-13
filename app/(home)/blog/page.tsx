'use client'
import React, { useState } from "react";
import Footer from "@/components/home/footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarNav } from "@/components/sidebar-nav";

const blogPosts = [
	{
		id: 1,
		title: "How to Start Your VA Claim",
		summary: "A comprehensive guide to starting your VA claim process.",
		date: "2023-01-01",
		image: "/images/blog1.jpg",
	},
	{
		id: 2,
		title: "Top 5 Tips for a Successful VA Claim",
		summary: "Tips to ensure your VA claim is successful.",
		date: "2023-02-01",
		image: "/images/blog2.jpg",
	},
	// Add 8 more blog posts here
];

export default function BlogPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredPosts = blogPosts.filter((post) =>
		post.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<>
			<h1 className="w-full text-center text-3xl font-bold my-4 mt-40">Veterans VA Claims Blog</h1>
			<div className="flex justify-center my-6">
				<input
					type="text"
					placeholder="Search blog posts..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="w-1/2 p-2 border border-gray-300 rounded-lg"
				/>
			</div>
			<div className="flex my-6 px-4">
				<SidebarNav
					className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md"
					items={blogPosts.map((post) => ({
						href: `/blog/${post.id}`,
						title: post.title,
					}))}
				/>
				<div className="w-3/4 grid grid-cols-1 gap-4 p-4">
					{filteredPosts.map((post) => (
						<Card key={post.id} className="bg-gray-100 shadow-lg">
							<CardHeader className="p-2">
								<img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded-t-lg" />
								<CardTitle className="mt-2 text-lg font-bold">{post.title}</CardTitle>
								<CardDescription className="mt-1 text-gray-600">{post.summary}</CardDescription>
							</CardHeader>
							<CardContent className="p-2">
								<p className="text-sm text-gray-500">Published on: {post.date}</p>
							</CardContent>
							<CardFooter className="p-2 flex justify-between">
								<a href={`/blog/${post.id}`} className="text-blue-500 hover:underline">Read more</a>
								<div>
									<a href={`https://twitter.com/share?url=/blog/${post.id}`} className="text-blue-500 hover:underline mr-2">Share on Twitter</a>
									<a href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${post.id}`} className="text-blue-500 hover:underline">Share on Facebook</a>
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
			<Footer isHomePage={false} />
		</>
	);
}