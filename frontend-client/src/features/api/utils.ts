export const joinUrls = (...urls: readonly (string | undefined)[]) =>
  urls
    .filter((url) => typeof url === "string")
    .concat("")
    .join("/")
    .split("://")
    .map((str) => str.replace(/\/+/g, "/"))
    .join("://");
