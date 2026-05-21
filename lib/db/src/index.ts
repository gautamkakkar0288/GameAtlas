import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
export { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import pg from "pg";
import * as schema from "./schema/index.js";

const { Pool } = pg;

type Database = NodePgDatabase<typeof schema>;

interface Connection {
  pool: pg.Pool;
  db: Database;
}

let connection: Connection | null = null;

function getConnection(): Connection {
  if (connection) return connection;

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  const nextPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.PGSSLMODE === "disable"
        ? false
        : process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : undefined,
  });

  connection = {
    pool: nextPool,
    db: drizzle(nextPool, { schema }),
  };

  return connection;
}

export const pool = new Proxy({} as pg.Pool, {
  get(_target, property, receiver) {
    const value = Reflect.get(getConnection().pool, property, receiver);
    return typeof value === "function" ? value.bind(getConnection().pool) : value;
  },
});

export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    const value = Reflect.get(getConnection().db, property, receiver);
    return typeof value === "function" ? value.bind(getConnection().db) : value;
  },
});

export * from "./schema/index.js";
