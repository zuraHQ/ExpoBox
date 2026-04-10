const { Hono } = require("hono");
const { serve } = require("@hono/node-server");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const app = new Hono();

const PROJECT_DIR = "/app/project";
const EXPO_LOG_FILE = "/tmp/expo-logs.txt";

app.use("*", async (c, next) => {
  if (c.req.path === "/health" || c.req.path === "/status" || c.req.path === "/debug") {
    return next();
  }

  const auth = c.req.header("Authorization");
  const expected = process.env.PREVIEW_SECRET;

  if (!expected || auth !== `Bearer ${expected}`) {
    return c.json({ error: "unauthorized" }, 401);
  }

  return next();
});

app.get("/health", (c) => {
  return c.json({ ok: true });
});

app.get("/status", async (c) => {
  let expoUrl = null;
  let webUrl = null;
  let status = "starting";
  let logs = "";

  try {
    const res = await fetch("http://127.0.0.1:4040/api/tunnels");
    if (res.ok) {
      const data = await res.json();
      const tunnel = data.tunnels?.find(t => t.proto === "https");
      if (tunnel?.public_url) {
        const host = tunnel.public_url.replace("https://", "");
        expoUrl = `exp://${host}:80`;
        webUrl = tunnel.public_url;
        status = "running";
      }
    }
  } catch {}

  if (!expoUrl) {
    try {
      const metroRes = await fetch("http://localhost:8081/status");
      if (metroRes.ok) status = "metro_running";
    } catch {}
  }

  try {
    logs = fs.readFileSync(EXPO_LOG_FILE, "utf-8");
  } catch {}

  return c.json({ status, expoUrl, webUrl, logs });
});

app.get("/debug", async (c) => {
  const info = {};
  try { info.expoLogs = fs.readFileSync(EXPO_LOG_FILE, "utf-8"); } catch { info.expoLogs = "no log file"; }
  try { info.processes = execSync("ps aux", { encoding: "utf-8" }); } catch (e) { info.processes = e.message; }
  try {
    const res = await fetch("http://localhost:8081/status");
    info.metroStatus = await res.text();
  } catch (e) { info.metroStatus = e.message; }
  try { info.projectFiles = execSync("ls /app/project/", { encoding: "utf-8" }); } catch (e) { info.projectFiles = e.message; }
  return c.json(info);
});

app.put("/files/*", async (c) => {
  const filePath = c.req.path.replace("/files/", "");
  const fullPath = path.join(PROJECT_DIR, filePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  const body = await c.req.text();
  fs.writeFileSync(fullPath, body);

  return c.json({ ok: true });
});

app.delete("/files/*", (c) => {
  const filePath = c.req.path.replace("/files/", "");
  const fullPath = path.join(PROJECT_DIR, filePath);

  try {
    fs.unlinkSync(fullPath);
  } catch {}

  return c.json({ ok: true });
});

app.post("/sync", async (c) => {
  const { files } = await c.req.json();

  for (const file of files) {
    const fullPath = path.join(PROJECT_DIR, file.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.code);
  }

  return c.json({ ok: true, count: files.length });
});

app.post("/install", async (c) => {
  const { packages } = await c.req.json();

  try {
    execSync(`npx expo install ${packages.join(" ")}`, {
      cwd: PROJECT_DIR,
      stdio: "pipe",
      timeout: 60000,
    });
    return c.json({ ok: true });
  } catch (err) {
    return c.json({ ok: false, error: err.message });
  }
});

serve({ fetch: app.fetch, port: 3100 }, () => {
  console.log("Preview sidecar running on :3100");
});
