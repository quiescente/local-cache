# local-cache

## Installing

```
deno add jsr:@quiescente/local-cache
```

## Using

```
import { LocalCache } from "@quiescente/local-cache";
import { assertEquals } from "@std/assert";

const cache = new LocalCache("./todos.db");

cache.set("try_out_deno", { description: "Try out deno", complete: true });
cache.set("build_some_pocs", { description: "Build some POCs", complete: false });


assertEquals(cache.get("try_out_deno")?.complete, true);
assertEquals(cache.get("build_some_pocs")?.complete, false);

cache.set("build_some_pocs", { description: "Build some POCs", complete: true });

assertEquals(cache.get("build_some_pocs")?.complete, true);
```
