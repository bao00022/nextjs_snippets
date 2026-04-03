import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const DBPATH = process.env.VERCEL ? "/tmp/dev.sqlite" : "./data/dev.sqlite";
const DEFAULT_RESET_INTERVAL_MS = 5 * 60 * 1000;
const META_LAST_RESET_KEY = "last_demo_reset_at";

const DEFAULT_SNIPPETS: Array<{ title: string; code: string }> = [
  {
    title: "Hello World",
    code: `const greeting: string = "Hello, World!";
const times: number = 3;

for (let i = 1; i <= times; i += 1) {
  const message = i + ". " + greeting;
  console.log(message);
}

console.log("Done printing greetings.");`,
  },
  {
    title: "Array Map",
    code: `const source = [1, 2, 3, 4, 5];
const doubled = source.map((value) => value * 2);
const withIndex = doubled.map((value, index) => ({
  index,
  value,
}));

console.table(withIndex);
console.log("Total:", doubled.reduce((sum, n) => sum + n, 0));`,
  },
  {
    title: "Fetch API",
    code: `async function loadUsers() {
  const response = await fetch("/api/users", {
    headers: { "Accept": "application/json" },
  });

  if (!response.ok) throw new Error("Request failed");
  const users = await response.json();
  return users;
}

loadUsers().then(console.log).catch(console.error);`,
  },
  {
    title: "User Description",
    code: `type User = {
  id: number;
  name: string;
  isAdmin: boolean;
};

function describeUser(user: User): string {
  const role = user.isAdmin ? "admin" : "member";
  return user.name + " (#" + user.id + ") is a " + role;
}

console.log(describeUser({ id: 1, name: "Wesker", isAdmin: true }));`,
  },
  {
    title: "Group By Category",
    code: `const items = [
  { id: 1, category: "tool" },
  { id: 2, category: "book" },
  { id: 3, category: "tool" },
  { id: 4, category: "snack" },
];

const grouped = Object.groupBy(items, (item) => item.category);
console.log(grouped);`,
  },
];

export class DbClient {
  private db: Database | null = null;
  private static instance: DbClient | null = null;
  private initPromise: Promise<void> | null = null;
  private resetPromise: Promise<void> | null = null;
  private readonly isDemoAutoResetEnabled = process.env.DEMO_AUTO_RESET_ENABLED !== "false";
  private readonly demoResetIntervalMs = Number(process.env.DEMO_RESET_INTERVAL_MS ?? DEFAULT_RESET_INTERVAL_MS);

  private constructor() {
    // private constructor to prevent direct instantiation
  }

  public static getInstance(): DbClient {
    if (!this.instance) {
      this.instance = new DbClient();
    }
    return this.instance;
  }

  public async getConnection(): Promise<Database> {
    try {
      if (!this.db) {
        this.db = await open({
          filename: DBPATH,
          driver: sqlite3.Database,
        });
      }

      // Ensure schema is created once before any query uses the connection.
      if (!this.initPromise) {
        this.initPromise = this.initializeDatabase();
      }
      await this.initPromise;
      await this.ensureDemoDataIsFresh();

      return this.db;
    } catch (error) {
      throw error;
    }
  }

  public async closeConnection(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // initialize the database with the necessary tables and seed data
  private async initializeDatabase(): Promise<void> {
    try {
      if (!this.db) {
        throw new Error("Database connection is not initialized.");
      }

      const db = this.db;
      await db.exec(`
                CREATE TABLE IF NOT EXISTS snippets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    code TEXT
                );
            `);

      await db.exec(`
                CREATE TABLE IF NOT EXISTS app_meta (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                );
            `);

      const row = (await db.get(`SELECT COUNT(*) as count FROM snippets`)) as { count: number };
      if (row.count === 0) {
        await this.resetSnippetsToDefaults(db);
      } else {
        const metaRow = (await db.get(`SELECT value FROM app_meta WHERE key = ?`, [META_LAST_RESET_KEY])) as
          | { value: string }
          | undefined;
        if (!metaRow) {
          await this.setLastResetTimestamp(db, Date.now());
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private async ensureDemoDataIsFresh(): Promise<void> {
    if (!this.db || !this.isDemoAutoResetEnabled) {
      return;
    }

    if (!Number.isFinite(this.demoResetIntervalMs) || this.demoResetIntervalMs <= 0) {
      return;
    }

    if (!this.resetPromise) {
      this.resetPromise = this.maybeResetDemoData(this.db).finally(() => {
        this.resetPromise = null;
      });
    }

    await this.resetPromise;
  }

  private async maybeResetDemoData(db: Database): Promise<void> {
    const now = Date.now();
    const row = (await db.get(`SELECT value FROM app_meta WHERE key = ?`, [META_LAST_RESET_KEY])) as
      | { value: string }
      | undefined;

    const lastResetAt = Number(row?.value);
    const isFirstCheck = !Number.isFinite(lastResetAt);
    const isExpired = !isFirstCheck && now - lastResetAt >= this.demoResetIntervalMs;

    if (isFirstCheck || isExpired) {
      await this.resetSnippetsToDefaults(db);
      return;
    }
  }

  private async resetSnippetsToDefaults(db: Database): Promise<void> {
    await db.exec("BEGIN IMMEDIATE TRANSACTION;");

    try {
      await db.run(`DELETE FROM snippets`);
      await db.run(`DELETE FROM sqlite_sequence WHERE name = 'snippets'`);

      const insertSql = `INSERT INTO snippets (title, code) VALUES (?, ?)`;
      for (const snippet of DEFAULT_SNIPPETS) {
        await db.run(insertSql, [snippet.title, snippet.code]);
      }

      await this.setLastResetTimestamp(db, Date.now());
      await db.exec("COMMIT;");
    } catch (error) {
      await db.exec("ROLLBACK;");
      throw error;
    }
  }

  private async setLastResetTimestamp(db: Database, timestampMs: number): Promise<void> {
    await db.run(
      `
      INSERT INTO app_meta (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `,
      [META_LAST_RESET_KEY, String(timestampMs)],
    );
  }
}

export interface Snippet {
  id: number;
  title: string;
  code: string;
}
