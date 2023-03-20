/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.w3s.link',
        port: '',
        pathname: '/avatar.png',
      },
    ],
  }
}
