import { createRequire } from "node:module";

async function loadCacheFactory() {
    const ORIGINAL_REQUIRE = globalThis.require;
    globalThis.require = createRequire(import.meta.url);

    try {
        const CACHE_MODULE = await import("file-system-cache");
        return CACHE_MODULE.default;
    } finally {
        if (ORIGINAL_REQUIRE === undefined) {
            delete globalThis.require;
        } else {
            globalThis.require = ORIGINAL_REQUIRE;
        }
    }
}

const CACHE_FACTORY = await loadCacheFactory();
const CACHE = CACHE_FACTORY();

export { CACHE };
