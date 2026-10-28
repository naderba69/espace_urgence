import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

const SW_SOURCE = readFileSync("public/sw.js", "utf8");

type ServiceWorkerRequest = {
  url: string;
  method: string;
  mode: string;
  headers: { get(name: string): string | null };
};
type ServiceWorkerEvent = {
  request?: ServiceWorkerRequest;
  respondWith?: (response: Promise<Response> | Response) => void;
  waitUntil?: (promise: Promise<unknown>) => void;
};
type ServiceWorkerListener = (event: ServiceWorkerEvent) => void;

async function navigateOffline({
  scope,
  requestPath,
  cachedPaths = [],
}: {
  scope: string;
  requestPath: string;
  cachedPaths?: string[];
}): Promise<Response> {
  const origin = new URL(scope).origin;
  const entries = new Map(cachedPaths.map((path) => [new URL(path, origin).href, new Response(`cached:${path}`)]));
  const listeners = new Map<string, ServiceWorkerListener>();
  const caches = {
    match: async (input: string | { url: string }, options?: { ignoreSearch?: boolean }) => {
      const href = typeof input === "string" ? new URL(input, origin).href : input.url;
      const candidate = new URL(href);
      for (const [key, response] of entries) {
        const cached = new URL(key);
        if (cached.origin !== candidate.origin || cached.pathname !== candidate.pathname) continue;
        if (options?.ignoreSearch || cached.search === candidate.search) return response.clone();
      }
      return undefined;
    },
    open: async () => ({ put: async () => undefined }),
  };
  const self = {
    registration: { scope },
    addEventListener: (type: string, listener: ServiceWorkerListener) => listeners.set(type, listener),
    skipWaiting: async () => undefined,
    clients: { claim: async () => undefined },
  };
  const context = {
    self,
    caches,
    location: { origin },
    URL,
    Request,
    Response,
    fetch: async () => { throw new TypeError("offline"); },
  };
  vm.runInNewContext(SW_SOURCE, context, { filename: "public/sw.js" });

  const listener = listeners.get("fetch");
  if (!listener) throw new Error("Service worker fetch listener was not registered");
  let response: Promise<Response> | Response | undefined;
  const event: ServiceWorkerEvent = {
    request: {
      url: new URL(requestPath, origin).href,
      method: "GET",
      mode: "navigate",
      headers: { get: () => null },
    },
    respondWith: (value) => { response = value; },
  };
  listener(event);
  if (!response) throw new Error("Navigation was not intercepted");
  return await response;
}

describe("repli de navigation hors-ligne du service worker", () => {
  it("renvoie la page intégrée si le réseau et tous les caches sont indisponibles", async () => {
    const response = await navigateOffline({ scope: "https://example.test/", requestPath: "/non-cachee" });
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(await response.text()).toContain("Hors-ligne");
  });

  it("retrouve une fiche en cache malgré la barre finale à la racine", async () => {
    const response = await navigateOffline({
      scope: "https://example.test/",
      requestPath: "/protocoles/acr-adulte/",
      cachedPaths: ["/protocoles/acr-adulte"],
    });
    expect(await response.text()).toBe("cached:/protocoles/acr-adulte");
  });

  it("retrouve une fiche en cache sous un base path sans le préfixer deux fois", async () => {
    const response = await navigateOffline({
      scope: "https://example.test/espace_urgence/",
      requestPath: "/espace_urgence/protocoles/acr-adulte/",
      cachedPaths: ["/espace_urgence/protocoles/acr-adulte"],
    });
    expect(await response.text()).toBe("cached:/espace_urgence/protocoles/acr-adulte");
  });
});
