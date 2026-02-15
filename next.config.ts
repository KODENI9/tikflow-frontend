/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  // Autorise l'accès via ton IP réseau
  allowedDevOrigins: ["10.0.10.35:3000", "localhost:3000"],
};

export default nextConfig;
