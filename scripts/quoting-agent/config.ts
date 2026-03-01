import { load } from "https://deno.land/std/dotenv/mod.ts";

const env = await load({
  envPath: "./scripts/quoting-agent/.env",
  export: true,
});

export const ENV = {
  APP_PASSWORD: env["APP_PASSWORD"] || "",
  EMAIL_USER: env["EMAIL"] || "pricing@internationalrelocationpartner.com",
  GEMINI_API_KEY: env["GEMINI_API_KEY"] || "",
  MOVERS_POE_USERNAME: env["MOVERS_POE_USERNAME"] || "Lucas",
  MOVERS_POE_PASSWORD: env["MOVERS_POE_PASSWORD"] || "Yolanda",
  MOVERS_POE_URL: env["MOVERS_POE_URL"] || "https://www.moverspoe.com/",
};

const configText = await Deno.readTextFile(
  "./scripts/quoting-agent/config.json",
);
export const CONFIG = JSON.parse(configText);
