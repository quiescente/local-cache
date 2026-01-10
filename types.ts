/**
 * The definition of the PersistenceLayer interface. Used for the db property of a `LocalCache` instance.
 * A value is set and retrieved as a string.
 */
export interface PersistenceLayer {
  set: (key: string, value: string) => void;
  get: (key: string) => string | undefined;
  delete: (key: string) => void;
}

/**
 * The definition of the SerializablePersistenceLayer interface. Implemented by the `LocalCache` class.
 * Different from the `PersistenceLayer` one, here the set and get methods have parameters for a `serialize` and a `deserialize` function allowing to send the value parameters in its original type, and retrieving it back when using the `get` method in its intended type.
 */
export interface SerializablePersistenceLayer {
  set: <T>(key: string, value: T, serialize: (value: T) => string) => void;
  get: <T>(
    key: string,
    deserialize: (value: string) => T | undefined,
  ) => T | undefined;
  delete: (key: string) => void;
}
