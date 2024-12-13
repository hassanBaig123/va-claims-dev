import React from 'react';
import ContactForm from '@/components/home/contactform';

export default function ContactPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="container mx-auto px-4 py-8 max-w-2xl bg-white rounded-lg shadow-md">
				<h1 className="text-3xl font-bold mb-6">Contact Us</h1>
				<p className="mb-8">
					Have a question or need support? Fill out the form below and we'll get back to you as soon as possible.
				</p>
				<ContactForm />
			</div>
		</div>
	);
}