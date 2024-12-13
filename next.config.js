/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: process.env.ALLOWED_ORIGIN},
                   
                ]
            }
        ]
    },
    reactStrictMode: false,
    distDir: 'build',
    images: {
        domains: ['images.unsplash.com'],
    },
    experimental: {
        turbotrace: {
            logLevel: 'info',
        },
    },
};

module.exports = nextConfig;