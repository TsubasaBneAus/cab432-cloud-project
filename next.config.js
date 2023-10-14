/** @type {import('next').NextConfig} */
const nextConfig = {
  // Uncomment below when developing the app in docker to enable hot reloading
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 5000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
