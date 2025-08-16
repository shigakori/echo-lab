export const metadata = {
  title: "Home",
  description:
    "Welcome to Echo Lab Studio - Creative digital agency specializing in web design, digital art, and innovative solutions. Discover our portfolio and creative process.",
  keywords: [
    "Echo Lab Studio",
    "creative agency",
    "web design",
    "digital art",
    "portfolio",
    "creative studio",
    "homepage",
  ],
  openGraph: {
    title: "Echo Lab Studio - Creative Digital Agency",
    description:
      "Welcome to Echo Lab Studio - Creative digital agency specializing in web design, digital art, and innovative solutions.",
    url: "https://echo-lab-studio.com",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Echo Lab Studio Homepage",
      },
    ],
  },
  twitter: {
    title: "Echo Lab Studio - Creative Digital Agency",
    description:
      "Welcome to Echo Lab Studio - Creative digital agency specializing in web design, digital art, and innovative solutions.",
  },
};

export default function HomeLayout({ children }) {
  return children;
} 