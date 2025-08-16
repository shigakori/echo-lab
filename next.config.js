const path = require("path");

const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const useSplitTextStub =
  isGithubActions || process.env.NEXT_PUBLIC_USE_SPLITTEXT_STUB === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath,
  assetPrefix: basePath,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    if (useSplitTextStub) {
      config.resolve.alias["gsap/SplitText"] = path.resolve(
        __dirname,
        "src/lib/splitTextStub.js"
      );
    }
    return config;
  },
};

module.exports = nextConfig;
