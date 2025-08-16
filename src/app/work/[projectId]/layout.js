import { portfolio } from "../portfolio";

export async function generateMetadata({ params }) {
  let projectData = null;
  let yearGroup = null;
  for (const yearData of portfolio) {
    const found = yearData.projects.find(
      (project) => project.id === params.projectId
    );
    if (found) {
      projectData = found;
      yearGroup = yearData;
      break;
    }
  }

  if (!projectData) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  const tagsArray = projectData.tags.split(", ");
  const description = `Explore ${projectData.name} - a ${tagsArray.join(
    ", "
  )} project by Echo Lab Studio. Discover our creative approach to ${
    tagsArray[0]
  } and ${tagsArray[1] || tagsArray[0]}.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: projectData.name,
    description: description,
    creator: {
      "@type": "Organization",
      name: "Echo Lab Studio",
      url: "https://echo-lab-studio.com",
    },
    dateCreated: yearGroup.year,
    genre: tagsArray,
    image: projectData.img,
    url: `https://echo-lab-studio.com/work/${params.projectId}`,
    publisher: {
      "@type": "Organization",
      name: "Echo Lab Studio",
    },
  };

  return {
    title: projectData.name,
    description: description,
    keywords: [
      projectData.name,
      "Echo Lab Studio",
      "creative project",
      "web design",
      "digital art",
      "portfolio",
      ...tagsArray,
    ],
    openGraph: {
      title: `${projectData.name} - Echo Lab Studio`,
      description: description,
      url: `https://echo-lab-studio.com/work/${params.projectId}`,
      images: [
        {
          url: projectData.img || "/images/og-project.jpg",
          width: 1200,
          height: 630,
          alt: projectData.name,
        },
      ],
      type: "article",
      publishedTime: `${yearGroup.year}-01-01T00:00:00.000Z`,
      modifiedTime: undefined,
      authors: ["Echo Lab Studio"],
    },
    twitter: {
      title: `${projectData.name} - Echo Lab Studio`,
      description: description,
      images: [projectData.img || "/images/og-project.jpg"],
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}

export default function ProjectLayout({ children }) {
  return children;
}
