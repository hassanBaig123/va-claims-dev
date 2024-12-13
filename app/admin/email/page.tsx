'use client';

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function EmailPage() {
  const [email, setEmail] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendToAll) {
      setShowConfirmDialog(true);
    } else {
      await sendEmail();
    }
  };

  const sendEmail = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/email/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, sendToAll, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }

      setStatus('success');
    } catch (error) {
      console.error('Error sending emails:', error);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Send Email</h1>
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <h2 className="text-xl font-semibold mb-2 text-blue-800">Instructions:</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>To send an email to a single user, enter their email address in the field below.</li>
          <li>To send an email to all users, check the "Send to All Users" box.</li>
          <li>Compose your message in the text area provided.</li>
          <li>Click "Send Email" when you're ready to send.</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center space-x-2 text-lg font-medium text-gray-700">
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Send to All Users</span>
          </label>
          {sendToAll && (
            <p className="mt-1 text-sm text-red-500">Warning: This will send the email to all users.</p>
          )}
        </div>
        {!sendToAll && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required={!sendToAll}
            />
          </div>
        )}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={8}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send Email'}
        </button>
        {status === 'success' && (
          <p className="text-green-600 font-medium">Emails sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 font-medium">Failed to send emails. Please try again.</p>
        )}
      </form>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Sending to All Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this email to all users? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowConfirmDialog(false);
              sendEmail();
            }}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
