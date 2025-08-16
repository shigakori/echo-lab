export const metadata = {
  title: "Work",
  description:
    "Explore our creative portfolio at Echo Lab Studio. Discover innovative web design projects, digital art, and creative solutions that push boundaries.",
  keywords: [
    "portfolio",
    "creative work",
    "web design projects",
    "digital art",
    "Echo Lab Studio",
    "creative projects",
    "design portfolio",
  ],
  openGraph: {
    title: "Work Portfolio - Echo Lab Studio",
    description:
      "Explore our creative portfolio at Echo Lab Studio. Discover innovative web design projects, digital art, and creative solutions.",
    url: "https://echo-lab-studio.com/work",
    images: [
      {
        url: "/images/og-work.jpg",
        width: 1200,
        height: 630,
        alt: "Echo Lab Studio Work Portfolio",
      },
    ],
  },
  twitter: {
    title: "Work Portfolio - Echo Lab Studio",
    description:
      "Explore our creative portfolio at Echo Lab Studio. Discover innovative web design projects, digital art, and creative solutions.",
  },
};

export default function WorkLayout({ children }) {
  return children;
}
