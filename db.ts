import { DatabaseSync } from "node:sqlite";
import type { PersistenceLayer } from "./types.ts";

export class Database implements PersistenceLayer {
  public location: string;
  private db: DatabaseSync;

  constructor(location: string) {
    this.location = location;
    this.db = new DatabaseSync(`${location}`);

    this.db.exec(
      `
	CREATE TABLE IF NOT EXISTS main (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  key TEXT,
	  value TEXT
	);
  `,
    );
    this.db.exec(
      `
  CREATE INDEX IF NOT EXISTS idx_key ON main (key)
`,
    );
  }

  public set(key: string, value: string) {
    const v = this.get(key);

    switch (v) {
      case undefined:
        this.db.prepare(
          `
	INSERT INTO main (key, value) VALUES ($key, $value);`,
        ).run({ $key: key, $value: value });
        break;

      default:
        this.db.prepare(
          `
  UPDATE main
	SET value = $value
  WHERE key = $key;`,
        ).run({ $key: key, $value: value });
        break;
    }
  }

  public get(key: string): string | undefined {
    const row = this.db.prepare("SELECT value FROM main WHERE key = $key").get({
      $key: key,
    });

    return row?.value ? row.value.toString() : undefined;
  }

  public delete(key: string) {
    this.db.prepare(`DELETE from main WHERE key = $key;`).run({ $key: key });
  }
}
