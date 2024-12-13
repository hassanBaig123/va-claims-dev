'use client'
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const SignupDialog = () => {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");

    const sendMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("sendMagicLink function called"); // Add this line
        try {
          const response = await fetch('/api/sendMagicLink', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
          const result = await response.json();
          console.log("Server response:", result); // Add this line
          if (!response.ok) {
            throw new Error(result.error || "Failed to send magic link.");
          }
          setStatus("Magic link sent successfully!");
        } catch (error) {
          console.error("Error:", error); // Add this line
          setStatus("Error sending magic link.");
        }
      };

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="btn">Sign Up</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign Up</DialogTitle>
					<DialogDescription>Enter your email to receive a magic link.</DialogDescription>
				</DialogHeader>
				<form onSubmit={sendMagicLink}>
					<div className="form-group">
						<label htmlFor="email">Email:</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<DialogFooter>
						<button type="submit" className="btn">Send Magic Link</button>
					</DialogFooter>
				</form>
				{status && <p>{status}</p>}
			</DialogContent>
		</Dialog>
	);
};

export default SignupDialog;
