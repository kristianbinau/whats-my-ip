import { getRequestIP } from "h3";

export default defineEventHandler((event) => {
  const ip = getRequestIP(event, { xForwardedFor: true });

  if (ip === undefined) {
    throw createError({
      statusCode: 400,
      statusMessage: "IP address not found",
    });
  }

  return ip;
});
