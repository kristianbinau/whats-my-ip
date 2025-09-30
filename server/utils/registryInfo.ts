import type { H3Event } from "h3";
import {
  ApiError,
  ClientError,
  IpregistryClient,
  type ApiResponse,
  type IpInfo,
} from "@ipregistry/client";

export const cachedRegistryInfo = defineCachedFunction(
  async (event: H3Event, ip: string): Promise<IpInfo> => {
    const apiKey = getIPRegistryApiKey(event);

    try {
      const client: IpregistryClient = new IpregistryClient(apiKey);
      const response: ApiResponse<IpInfo> = await client.lookupIp(ip);

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        // Handle API error here (e.g. Invalid API key or IP address)
        console.error("API error", error);
      } else if (error instanceof ClientError) {
        // Handle client error here (e.g. request timeout)
        console.error("Client error", error);
      } else {
        // Handle unexpected error here
        console.error("Unexpected error", error);
      }

      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      });
    }
  },
  {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    name: "registry",
    getKey: (event: H3Event, ip: string) => ip,
  }
);

function getIPRegistryApiKey(event: H3Event): string {
  const config = useRuntimeConfig(event);

  if (!config.ipregistryApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing ipregistryApiKey",
    });
  }

  return config.ipregistryApiKey;
}
