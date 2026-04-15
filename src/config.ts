export const CONFIG = {
  siteTitle: "The Heavenly HON",
  siteTagline: "A devoted collection of Indiana Glass Hen-on-Nest covered dishes",
  repoOwner: import.meta.env.VITE_REPO_OWNER ?? "your-github-username",
  repoName: import.meta.env.VITE_REPO_NAME ?? "hon-tracker",
  branch: import.meta.env.VITE_REPO_BRANCH ?? "main",
};

export const dataPath = {
  collection: "public/data/collection.json",
  prices: "public/data/prices.json",
  photosDir: "public/photos",
};
