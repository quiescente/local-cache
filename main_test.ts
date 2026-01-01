import { assertEquals } from "@std/assert";
import { LocalCache } from "./main.ts";

const cache = new LocalCache(":memory:");

Deno.test(function localCacheLocationTest() {
  assertEquals(cache.location, ":memory:");
});

Deno.test(function localCacheUpsertTest() {
  ["A", "B", "C", "D"].forEach((value) => {
    cache.set("k", value);

    assertEquals(cache.get("k"), value);
  });
});

Deno.test(function cacheReturnUndefinedOnMissingKeyTest() {
  assertEquals(
    cache.get("non_existent_key"),
    undefined,
  );
});

Deno.test(function localCacheSerializationTest() {
  const values = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }];

  values.forEach((value, index) => {
    cache.set("object", value);

    const result = cache.get("object");

    assertEquals(typeof result, "object");
    assertEquals(result === null, false);

    const [[k, v]] = Object.entries(values[index]);

    assertEquals(result, value);
    assertEquals((result as unknown as { [key: string]: number })[k], v);
    assertEquals(typeof v, "number");
  });
});

Deno.test(function localCacheWithCustomSerializationTest() {
  const serialize = (value: number): string => {
    switch (value) {
      case 1:
        return "one";
      default:
        return "-";
    }
  };
  const deserialize = (value: string): number => {
    switch (value) {
      case "one":
        return 1;
      default:
        return 0;
    }
  };
  const values = [1, 0];
  const serialized = ["one", "-"];

  values.forEach((value, index) => {
    cache.set("o", value, serialize);

    const result = cache.get("o", deserialize);
    const serializedResult = cache.get("o", (x) => x.toString()) as string;

    assertEquals(typeof result, "number");
    assertEquals(result, deserialize(serialized[index]));
    assertEquals(serialize(value), serialized[index]);
    assertEquals(serializedResult, serialized[index]);
    assertEquals(deserialize(serializedResult), result);
  });
});
