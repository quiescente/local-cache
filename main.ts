import { Database } from "./db.ts";
import type {
  PersistenceLayer,
  SerializablePersistenceLayer,
} from "./types.ts";

/**
 * The LocalCache class implements the SerializablePersistenceLayer by exposing a set and a get method
 */
export class LocalCache implements SerializablePersistenceLayer {
  /* The location where the database should be created or looked up, ":memory:" can be used instead if SQLite is used (which is the default implementation) */
  public location: string;
  /* The implementation of the PersistenceLayer interface */
  private db: PersistenceLayer;

  /*
   * @param location This is where the database file will be created if using SQLite (which is the default), which also accepts ":memory:" so that the database is created in memory and not persisted to a file
   * @param db A function receiving the location string (from the first param) and returning a implementation of the PersistenceLayer interface
   */
  constructor(
    location: string,
    db: (location: string) => PersistenceLayer = (location) =>
      new Database(location),
  ) {
    this.location = location;
    this.db = db(location);
  }

  /*
   * A method to set a value in the cache
   * @param key A string for the cache entry key, which can be used for retrieving its value with the get method
   * @param value The value to be cached, it should be serializable (stringifiable) by the serialize function
   * @param serialize A function to serialize the value to a string, defaulting to `JSON.stringify`
   */
  public set<T>(
    key: string,
    value: T,
    serialize: (value: T) => string = JSON.stringify,
  ): void {
    return this.db.set(key, serialize(value));
  }

  /*
   * A method to get a value from the cache by key
   * @param key The key that was used to set a value before
   * @param deserialize A function to deserialize the value from a string to the expected type, defaulting to `JSON.parse`
   * @returns the deserialized value or undefined if nothing found by the passed in key
   */
  public get<T>(
    key: string,
    deserialize: (value: string) => T | undefined = JSON.parse,
  ): T | undefined {
    const value = this.db.get(key);

    return value !== undefined ? deserialize(value) : undefined;
  }

  /*
   * A method to delete a key from the cache
   * @param key The key that was used to set a value before
   */
  public delete(key: string) {
    this.db.delete(key);
  }
}
