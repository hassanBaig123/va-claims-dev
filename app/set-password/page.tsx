"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation"; // Updated import path
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoogleSignInButton from "@/components/global/google-sign-in-button";
import googleIcon from "/public/imgs/icons8-google.svg"; // Import Google icon

export default function SetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenHash = searchParams.get("code");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (tokenHash && emailParam) {
      handleCodeLogin(tokenHash);
      console.log("Logging in with code...");
    }
  }, [searchParams]);
// need to figure out why this error Error logging in with code: Only an email address or phone number should be provided on verify
// when user is first setting password after clicking confirm signup link
  const handleCodeLogin = async (tokenHash: string) => {
    const { error } = await supabase.auth.verifyOtp({     
      token_hash: tokenHash,
      type: 'email'
    });
    if (error) {
      alert("Error logging in with code: " + error.message);
    }
  };

  const handleSetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("Passwords do not match!");
      return;
    }

    // Update the password directly
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });
    if (updateError) {
      alert("Error updating password: " + updateError.message);
    } else {
      router.push("/todos");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center">
          Welcome, {email.split("@")[0]}
        </h1>
        <p className="text-sm text-gray-600 text-center">
          Please set your password or use Google Sign In to continue.
        </p>
        <form onSubmit={handleSetPassword} className="space-y-4">
          <input
            type="text"
            value={email}
            readOnly
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100 cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Set Password
          </button>
        </form>
        <div className="flex flex-col items-center justify-center space-x-2">
          <span className="text-gray-500 pb-5">or</span>
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
