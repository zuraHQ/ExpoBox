import { Hono } from "hono";
import { cors } from "hono/cors";

export { PreviewContainer } from "./preview-container";

type Env = {
  Bindings: {
    PREVIEW_CONTAINER: DurableObjectNamespace;
  };
};

const app = new Hono<Env>();

app.use("*", cors({ origin: "*" }));

app.get("/health", (c) => c.json({ ok: true }));

app.post("/api/preview", async (c) => {
  const { projectId } = await c.req.json();
  if (!projectId) return c.json({ error: "projectId required" }, 400);

  const id = c.env.PREVIEW_CONTAINER.idFromName(projectId);
  const stub = c.env.PREVIEW_CONTAINER.get(id);

  const statusRes = await stub.fetch(new Request("https://container/status"));
  const data = await statusRes.json() as { status: string; expoUrl: string | null };

  return c.json({ projectId, containerId: id.toString(), ...data });
});

app.get("/api/preview/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const id = c.env.PREVIEW_CONTAINER.idFromName(projectId);
  const stub = c.env.PREVIEW_CONTAINER.get(id);

  const statusRes = await stub.fetch(new Request("https://container/status"));
  const data = await statusRes.json() as { status: string; expoUrl: string | null };

  return c.json({ projectId, containerId: id.toString(), ...data });
});

app.put("/api/preview/:projectId/files/*", async (c) => {
  const projectId = c.req.param("projectId");
  const filePath = c.req.path.replace(`/api/preview/${projectId}/files/`, "");

  const id = c.env.PREVIEW_CONTAINER.idFromName(projectId);
  const stub = c.env.PREVIEW_CONTAINER.get(id);

  const body = await c.req.text();
  await stub.fetch(new Request(`https://container/files/${filePath}`, {
    method: "PUT",
    body,
  }));

  return c.json({ ok: true });
});

app.post("/api/preview/:projectId/sync", async (c) => {
  const projectId = c.req.param("projectId");
  const id = c.env.PREVIEW_CONTAINER.idFromName(projectId);
  const stub = c.env.PREVIEW_CONTAINER.get(id);

  const body = await c.req.text();
  const res = await stub.fetch(new Request("https://container/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }));

  return c.json(await res.json());
});

app.delete("/api/preview/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const id = c.env.PREVIEW_CONTAINER.idFromName(projectId);
  const stub = c.env.PREVIEW_CONTAINER.get(id);

  await stub.fetch(new Request("https://container/destroy", { method: "DELETE" }));

  return c.json({ ok: true });
});

export default app;
