/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
        port: '',
        pathname: '/ultrasound-images/**',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  rewrites: async () => {
    return [
      {
        source: '/flask-api/:path*',
        destination:
          process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5000/api/:path*' : '/api/',
      },
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
