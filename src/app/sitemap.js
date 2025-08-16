import { portfolio } from "./work/portfolio";

export default function sitemap() {
  const baseUrl = "https://echo-lab-studio.com";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sample-project`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const projectPages = portfolio.flatMap((yearGroup) =>
    yearGroup.projects.map((project) => ({
      url: `${baseUrl}/work/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }))
  );

  return [...staticPages, ...projectPages];
}
