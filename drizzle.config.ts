import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./drizzle/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_EBMT9rHbFxu1@ep-muddy-sky-a8gg44ii-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  },
});
