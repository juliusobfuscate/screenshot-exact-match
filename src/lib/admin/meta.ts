/** Shared head() metadata for the admin simulation pages. */
export function adminMeta(title: string, description: string) {
  const full = `${title} — Admin Panel Simulation`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
