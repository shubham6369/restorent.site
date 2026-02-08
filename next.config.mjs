/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // Enable React strict mode for better development experience
    reactStrictMode: true,
    // Disable x-powered-by header for security
    poweredByHeader: false,
};

export default nextConfig;
