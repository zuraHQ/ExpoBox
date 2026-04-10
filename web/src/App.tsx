import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787"

type PreviewState = {
  status: string
  expoUrl: string | null
  logs?: string
}

function App() {
  const [projectId, setProjectId] = useState("")
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [polling, setPolling] = useState(false)

  async function startPreview() {
    if (!projectId.trim()) return
    setPreview({ status: "creating", expoUrl: null })
    setPolling(true)

    await fetch(`${API_URL}/api/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: projectId.trim() }),
    })
  }

  useEffect(() => {
    if (!polling || !projectId) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/preview/${projectId}`)
        const data = await res.json()
        setPreview(data)
        if (data.status === "running" && data.expoUrl) {
          setPolling(false)
        }
      } catch {}
    }, 3000)

    return () => clearInterval(interval)
  }, [polling, projectId])

  async function destroyPreview() {
    if (!projectId) return
    await fetch(`${API_URL}/api/preview/${projectId}`, { method: "DELETE" })
    setPreview(null)
    setPolling(false)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", gap: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>ExpoBox</h1>
      <p style={{ color: "#888", margin: 0 }}>Self-hosted Expo dev servers on Cloudflare Containers</p>

      {!preview && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Project ID (any string)"
            style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: "#fff", fontSize: 14, width: 260 }}
          />
          <button
            onClick={startPreview}
            style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "#F6821F", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Start Preview
          </button>
        </div>
      )}

      {preview && preview.status !== "running" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 24, border: "3px solid #F6821F", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#888", fontSize: 14 }}>{preview.status === "creating" ? "Starting container..." : preview.status === "metro_running" ? "Metro running, waiting for tunnel..." : "Connecting tunnel..."}</p>
          {preview.logs && (
            <pre style={{ background: "#111", padding: 12, borderRadius: 8, fontSize: 11, color: "#666", maxWidth: 500, overflow: "auto", maxHeight: 200, whiteSpace: "pre-wrap" }}>
              {preview.logs}
            </pre>
          )}
        </div>
      )}

      {preview?.status === "running" && preview.expoUrl && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 16 }}>
            <QRCodeSVG value={preview.expoUrl} size={200} />
          </div>
          <p style={{ color: "#888", fontSize: 14 }}>Scan with Expo Go</p>
          <code style={{ background: "#1a1a1a", padding: "6px 12px", borderRadius: 6, fontSize: 12, color: "#F6821F" }}>{preview.expoUrl}</code>
          <button
            onClick={destroyPreview}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#888", fontSize: 13, cursor: "pointer" }}
          >
            Destroy Container
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default App
