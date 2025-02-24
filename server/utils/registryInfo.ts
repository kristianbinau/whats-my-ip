import type { H3Event } from "h3";
import {
  ApiError,
  ApiResponse,
  ClientError,
  IpInfo,
  IpregistryClient,
} from "@ipregistry/client";

export const cachedRegistryInfo = defineCachedFunction(
  async (event: H3Event, ip: string): Promise<IpInfo> => {
    const apiKey = getIPRegistryApiKey(event);

    try {
      console.log("Looking up IP address", ip);
      console.log("Using API key", apiKey);

      return {
        ip: "77.213.64.10",
        type: "IPv4",
        hostname: "077213064010.static.telenor.dk",
        carrier: {
          name: null,
          mcc: null,
          mnc: null,
        },
        company: {
          domain: null,
          name: "Cybercity A/s Xdsl Users",
          type: "isp",
        },
        connection: {
          asn: 9158,
          domain: "telenor.dk",
          organization: "Telenor A/s",
          route: "77.212.0.0/14",
          type: "isp",
        },
        currency: {
          code: "DKK",
          name: "Danish Krone",
          name_native: "dansk krone",
          plural: "Danish kroner",
          plural_native: "danske kroner",
          symbol: "DKK",
          symbol_native: "kr.",
          format: {
            decimal_separator: ",",
            group_separator: ".",
            negative: {
              prefix: "-",
              suffix: " kr.",
            },
            positive: {
              prefix: "",
              suffix: " kr.",
            },
          },
        },
        location: {
          continent: {
            code: "EU",
            name: "Europe",
          },
          country: {
            area: 43094,
            borders: ["DE"],
            calling_code: "45",
            capital: "Copenhagen",
            code: "DK",
            name: "Denmark",
            population: 5946952,
            population_density: 138,
            flag: {
              emoji: "🇩🇰",
              emoji_unicode: "U+1F1E9 U+1F1F0",
              emojitwo: "https://cdn.ipregistry.co/flags/emojitwo/dk.svg",
              noto: "https://cdn.ipregistry.co/flags/noto/dk.png",
              twemoji: "https://cdn.ipregistry.co/flags/twemoji/dk.svg",
              wikimedia: "https://cdn.ipregistry.co/flags/wikimedia/dk.svg",
            },
            languages: [
              {
                code: "da",
                name: "Danish",
                native: "dansk",
              },
              {
                code: "en",
                name: "English",
                native: "English",
              },
              {
                code: "fo",
                name: "Faroese",
                native: "føroyskt",
              },
              {
                code: "de",
                name: "German",
                native: "Deutsch",
              },
            ],
            tld: ".dk",
          },
          region: {
            code: "DK-84",
            name: "Hovedstaden",
          },
          city: "Virum",
          postal: "2830",
          latitude: 55.79346,
          longitude: 12.46933,
          language: {
            code: "da",
            name: "Danish",
            native: "dansk",
          },
          in_eu: true,
        },
        security: {
          is_abuser: false,
          is_attacker: false,
          is_bogon: false,
          is_cloud_provider: false,
          is_proxy: false,
          is_relay: false,
          is_tor: false,
          is_tor_exit: false,
          is_vpn: false,
          is_anonymous: false,
          is_threat: false,
        },
        time_zone: {
          id: "Europe/Copenhagen",
          abbreviation: "CET",
          current_time: "2025-02-24T19:15:17+01:00",
          name: "Central European Standard Time",
          offset: 3600,
          in_daylight_saving: false,
        },
        user_agent: {
          header:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
          name: "Firefox",
          type: "browser",
          version: "136.0",
          version_major: "136",
          device: {
            brand: null,
            name: "Desktop",
            type: "desktop",
          },
          engine: {
            name: "Gecko",
            type: "browser",
            version: "136.0",
            version_major: "136",
          },
          os: {
            name: "Windows NT",
            type: "desktop",
            version: ">=10",
          },
        },
      };

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
