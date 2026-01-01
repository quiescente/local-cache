import { assertEquals } from "@std/assert";
import { Database } from "./db.ts";

const db = new Database(":memory:");

Deno.test(function dbUpsertTest() {
  ["A", "B", "C", "D"].forEach((value) => {
    db.set("key", value);
    assertEquals(db.get("key"), value);
  });
});

Deno.test(function dbReturnUndefinedOnMissingKeyTest() {
  assertEquals(
    db.get("non_existent_key"),
    undefined,
  );
});
