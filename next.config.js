/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'res.cloudinary.com'],
    qualities: [75, 85],
  },
};

module.exports = nextConfig;
