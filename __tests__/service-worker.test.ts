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

function createRscHarness(scope: string) {
  const origin = new URL(scope).origin;
  const entries: Array<{ request: Request; response: Response }> = [];
  let online = true;
  const caches = {
    match: async (input: string | Request, options?: { ignoreSearch?: boolean }) => {
      const request = typeof input === "string" ? new Request(new URL(input, origin).href) : input;
      for (const entry of entries) {
        const keyUrl = new URL(entry.request.url);
        const requestUrl = new URL(request.url);
        if (keyUrl.origin !== requestUrl.origin || keyUrl.pathname !== requestUrl.pathname) continue;
        if (!options?.ignoreSearch && keyUrl.search !== requestUrl.search) continue;
        const vary = entry.response.headers.get("vary")?.split(",").map((header) => header.trim().toLowerCase()) ?? [];
        if (vary.includes("*")) continue;
        if (vary.some((header) => entry.request.headers.get(header) !== request.headers.get(header))) continue;
        return entry.response.clone();
      }
      return undefined;
    },
    open: async () => ({
      put: async (request: Request, response: Response) => {
        entries.push({ request, response: response.clone() });
      },
    }),
  };
  const listeners = new Map<string, ServiceWorkerListener>();
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
    fetch: async () => {
      if (!online) throw new TypeError("offline");
      return new Response("payload RSC", { headers: { "Content-Type": "text/x-component", Vary: "RSC, Next-Router-State-Tree" } });
    },
  };
  vm.runInNewContext(SW_SOURCE, context, { filename: "public/sw.js" });

  return {
    entries,
    setOnline(value: boolean) { online = value; },
    async request(url: string, headers: Record<string, string>) {
      const listener = listeners.get("fetch");
      if (!listener) throw new Error("Service worker fetch listener was not registered");
      let response: Promise<Response> | Response | undefined;
      const request = new Request(new URL(url, origin).href, { headers });
      listener({ request, respondWith: (value) => { response = value; } });
      if (!response) throw new Error("RSC request was not intercepted");
      return await response;
    },
  };
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

  it("conserve les en-têtes RSC requis par Vary tout en ignorant le querystring dynamique", async () => {
    const harness = createRscHarness("https://example.test/espace_urgence/");
    const onlineResponse = await harness.request("/espace_urgence/protocoles/acr-adulte/index.txt?_rsc=first", {
      RSC: "1",
      "Next-Router-State-Tree": "tree-a",
    });
    expect(await onlineResponse.text()).toBe("payload RSC");
    expect(harness.entries).toHaveLength(1);
    expect(new URL(harness.entries[0].request.url).search).toBe("");
    expect(harness.entries[0].request.headers.get("RSC")).toBe("1");
    expect(harness.entries[0].request.headers.get("Next-Router-State-Tree")).toBe("tree-a");

    harness.setOnline(false);
    const cachedResponse = await harness.request("/espace_urgence/protocoles/acr-adulte/index.txt?_rsc=second", {
      RSC: "1",
      "Next-Router-State-Tree": "tree-a",
    });
    expect(await cachedResponse.text()).toBe("payload RSC");

    const mismatchedResponse = await harness.request("/espace_urgence/protocoles/acr-adulte/index.txt?_rsc=third", {
      RSC: "1",
      "Next-Router-State-Tree": "tree-b",
    });
    expect(mismatchedResponse.status).toBe(0);
  });
});
