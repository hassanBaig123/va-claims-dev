'use client'
import { useState, useEffect } from 'react';

export const CookieConsent = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setShowModal(true);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all');
        setShowModal(false);
    };

    const handleAcceptEssential = () => {
        localStorage.setItem('cookieConsent', 'essential');
        setShowModal(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookieConsent', 'none');
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-100 p-4 rounded-lg shadow-lg z-50 w-full max-w-lg">
            <div className="flex justify-between items-start">
                <p className="text-sm mb-4">
                    This site uses cookies to improve your experience. By continuing to browse the site, you agree to our use of cookies.
                </p>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleReject}
                >
                    &times;
                </button>
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    className="bg-[#22c55e] text-white py-1 px-3 rounded hover:opacity-80"
                    onClick={handleAcceptAll}
                >
                    Accept All
                </button>
                <button
                    className="bg-oxfordBlue text-white py-1 px-3 rounded hover:opacity-80"
                    onClick={handleAcceptEssential}
                >
                    Accept Essential
                </button>
                <button
                    className="bg-crimsonNew text-white py-1 px-3 rounded hover:opacity-80"
                    onClick={handleReject}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};
