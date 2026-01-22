import type {NextConfig} from 'next'

const path = require('path')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS
    SC_DISABLE_SPEEDY: 'false',
  },
  outputFileTracingRoot: path.join(__dirname, './'),
}

export default nextConfig
