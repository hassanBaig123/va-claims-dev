'use client'
import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import crypto from 'crypto';

const supabase = createClient();

declare global {
  interface Window {
    handleSignInWithGoogle?: (response: any) => Promise<void>;
  }
}

const GoogleSignInButton = () => {
    const [nonce, setNonce] = useState('');
    const [hashedNonce, setHashedNonce] = useState('');

    useEffect(() => {
        const generateNonce = async () => {
            if (typeof window !== "undefined" && crypto.subtle) {
                const nonce = crypto.randomBytes(16).toString('base64') // Generate a random nonce
                const encoder = new TextEncoder();
                const encodedNonce = encoder.encode(nonce);
                const hash = await crypto.subtle.digest('SHA-256', encodedNonce);
                const bytes = new Uint8Array(hash);
                const hashedNonce = Array.from(bytes)
                    .map((b) => b.toString(16).padStart(2, '0'))
                    .join('');

                setNonce(nonce);
                setHashedNonce(hashedNonce);
            }
        };

        generateNonce();
    }, []);

    useEffect(() => {
        window.handleSignInWithGoogle = async (response) => {
            console.log(response);
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce: nonce,
            });

            if (data) {
                // Use window.location for navigation
                window.location.href = '/protected';
            } else if (error) {
                console.error('Error signing in with Google:', error);
            }
        };

        return () => {
            window.handleSignInWithGoogle = undefined;
        };
    }, [nonce]); // Removed isMounted from the dependency array

    useEffect(() => {
        // Dynamically load the Google Sign-In script after the component mounts
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Optional: Clean up the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []); // Empty dependency array ensures this effect runs only once after the initial render

    return (
        <>
            <div id="g_id_onload"
                data-client_id="838113098179-t4ik8d420lrq0dhbppl6bnl0gv2al7qi.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleSignInWithGoogle"
                data-nonce={hashedNonce}
                data-auto_prompt="false">
            </div>

            <div className="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="outline"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
        </>
    );
};

export default GoogleSignInButton;
