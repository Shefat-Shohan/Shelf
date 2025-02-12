import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/drizzle/db/schema";
const sql = neon(
  "postgresql://neondb_owner:npg_EBMT9rHbFxu1@ep-muddy-sky-a8gg44ii-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema });
