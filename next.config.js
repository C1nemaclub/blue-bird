/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    serverUrl: 'http://localhost:3000',
  },
  // Add the following lines to open the server on start
  server: {
    port: 3000,
    open: true,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
