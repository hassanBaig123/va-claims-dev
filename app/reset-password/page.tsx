"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoogleSignInButton from "@/components/global/google-sign-in-button";
import googleIcon from "/public/imgs/icons8-google.svg";

export default function ResetPasswordPage() {
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [isVerified, setIsVerified] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const supabase = createClient();

	// useEffect(() => {
	// 	const accessToken = searchParams.get("access_token");
	// 	if (accessToken) {
	// 		supabase.auth.setSession(accessToken).then(({ error }) => {
	// 			if (error) {
	// 				alert("Invalid or expired token.");
	// 			} else {
	// 				setIsVerified(true);
	// 			}
	// 		});
	// 	}
	// }, [searchParams, supabase]);

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== passwordConfirm) {
			alert("Passwords do not match!");
			return;
		}

		const { error } = await supabase.auth.updateUser({
			password: password,
		});

		if (error) {
			alert("Error resetting password: " + error.message);
		} else {
			alert("Password reset successfully!");
			router.push("/todos");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
			<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
				<h1 className="text-2xl font-semibold text-center">Reset Password</h1>
				{isVerified ? (
					<form onSubmit={handleResetPassword} className="space-y-4">
						<input
							type="password"
							placeholder="New Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
						<input
							type="password"
							placeholder="Confirm New Password"
							value={passwordConfirm}
							onChange={(e) => setPasswordConfirm(e.target.value)}
							className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
						<button
							type="submit"
							className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
						>
							Reset Password
						</button>
					</form>
				) : (
					<p className="text-center text-red-500">Verifying token...</p>
				)}
			</div>
		</div>
	);
}

