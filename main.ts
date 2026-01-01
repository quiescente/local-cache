import { Database } from "./db.ts";
import type { SerializablePersistenceLayer } from "./types.ts";

export class LocalCache implements SerializablePersistenceLayer {
  public location: string;
  private db: Database;

  constructor(
    location: string,
    db: (location: string) => Database = (location) => new Database(location),
  ) {
    this.location = location;
    this.db = db(location);
  }

  public set<T>(
    key: string,
    value: T,
    serialize: (value: T) => string = JSON.stringify,
  ) {
    return this.db.set(key, serialize(value));
  }

  public get<T>(
    key: string,
    deserialize: (value: string) => T | undefined = JSON.parse,
  ): T | undefined {
    const value = this.db.get(key);

    return value !== undefined ? deserialize(value) : undefined;
  }
}
