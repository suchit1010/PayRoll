/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  webpack: (config, { webpack }) => {
    // Allow importing of mjs modules (required for @solana/web3.js)
    config.resolve.extensions.push('.mjs');
    
    // Handle buffer polyfill
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: require.resolve('buffer/'),
    };
    
    // Add buffer polyfill
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );
    
    return config;
  },
};

module.exports = nextConfig;