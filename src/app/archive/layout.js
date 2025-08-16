export const metadata = {
  title: "Archive",
  description:
    "Browse our archive of past projects and creative work at Echo Lab Studio. Explore our journey through digital design and innovation.",
  keywords: [
    "project archive",
    "past projects",
    "creative archive",
    "Echo Lab Studio archive",
    "design history",
    "portfolio archive",
    "previous work",
  ],
  openGraph: {
    title: "Archive - Echo Lab Studio",
    description:
      "Browse our archive of past projects and creative work at Echo Lab Studio.",
    url: "https://echo-lab-studio.com/archive",
    images: [
      {
        url: "/images/og-archive.jpg",
        width: 1200,
        height: 630,
        alt: "Echo Lab Studio Archive",
      },
    ],
  },
  twitter: {
    title: "Archive - Echo Lab Studio",
    description:
      "Browse our archive of past projects and creative work at Echo Lab Studio.",
  },
};

export default function ArchiveLayout({ children }) {
  return children;
}
