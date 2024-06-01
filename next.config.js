/** @type {import('next').NextConfig} */
const packageJson = require('./package.json')
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'brsqcdlrwftfrrfdanov.supabase.co',
      },
    ],
  },
  env: {
    APP_VERSION: packageJson.version,
  },
}

module.exports = nextConfig
