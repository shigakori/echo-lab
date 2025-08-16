export const metadata = {
  title: "Studio",
  description:
    "Learn about Echo Lab Studio - our creative process, team, and approach to digital design. Discover how we bring innovative ideas to life.",
  keywords: [
    "Echo Lab Studio",
    "creative process",
    "design team",
    "digital agency",
    "creative approach",
    "studio about",
    "design philosophy",
  ],
  openGraph: {
    title: "Studio - Echo Lab Studio",
    description:
      "Learn about Echo Lab Studio - our creative process, team, and approach to digital design.",
    url: "https://echo-lab-studio.com/studio",
    images: [
      {
        url: "/images/og-studio.jpg",
        width: 1200,
        height: 630,
        alt: "Echo Lab Studio About",
      },
    ],
  },
  twitter: {
    title: "Studio - Echo Lab Studio",
    description:
      "Learn about Echo Lab Studio - our creative process, team, and approach to digital design.",
  },
};

export default function StudioLayout({ children }) {
  return children;
}
