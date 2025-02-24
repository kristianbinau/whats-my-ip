import { getRequestIP } from "h3";
import { UserAgents } from "@ipregistry/client";
import { cachedRegistryInfo } from "~~/server/utils/registryInfo";

export default eventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: true });
  if (ip === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "IP address not found",
    });
  }

  const userAgent = getRequestHeader(event, "user-agent");
  if (userAgent !== undefined && UserAgents.isBot(userAgent)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Crawler/bot not allowed",
    });
  }

  return cachedRegistryInfo(event, ip);
});
