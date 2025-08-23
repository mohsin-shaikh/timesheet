import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Import schemas
export * from "./schema/auth";

const client = createClient({
	url: process.env.DATABASE_URL || "",
});

export const db = drizzle({ client });
