/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true"
const pagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "/plantilla-cafeteria"

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubPages ? pagesBasePath : "",
  assetPrefix: isGithubPages ? `${pagesBasePath}/` : "",
}
export default nextConfig
