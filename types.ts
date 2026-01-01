export interface PersistenceLayer {
  set: (key: string, value: string) => void;
  get: (key: string) => string | undefined;
}

export interface SerializablePersistenceLayer {
  set: <T>(key: string, value: T, serialize: (value: T) => string) => void;
  get: <T>(
    key: string,
    deserialize: (value: string) => T | undefined,
  ) => T | undefined;
}
