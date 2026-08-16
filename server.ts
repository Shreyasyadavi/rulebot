import express from "express";
import http from "http";
import path from "path";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "RuleBot" });
  });

  app.get("/api/intents", async (_req, res) => {
    const fastApiUrl = process.env.VITE_API_URL || process.env.FASTAPI_URL;
    if (fastApiUrl) {
      try {
        const fetchRes = await fetch(`${fastApiUrl}/api/intents`);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          return res.json(data);
        }
      } catch {
        // Fallback to local Python execution
      }
    }

    try {
      const pythonProcess = spawn("python3", [
        "-c",
        "import json; from app.chatbot.rules import ALL_RULES; print(json.dumps([{'name': r.intent, 'intent': r.intent, 'category': r.category, 'exact_phrases': r.exact_phrases, 'keywords': r.keywords, 'patterns': r.patterns, 'response': r.responses[0] if r.responses else '', 'responses': r.responses, 'priority': r.priority, 'status': 'Active', 'matchType': 'Exact / Regex / Keyword', 'responseType': 'rule'} for r in ALL_RULES]))"
      ], {
        env: { ...process.env, PYTHONPATH: "backend" },
      });

      let stdout = "";
      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return res.json(parsed);
          } catch {
            return res.status(500).json({ error: "Failed to parse intents output" });
          }
        } else {
          return res.status(500).json({ error: "Failed to load intents catalog" });
        }
      });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/analytics", async (_req, res) => {
    const fastApiUrl = process.env.VITE_API_URL || process.env.FASTAPI_URL;
    if (fastApiUrl) {
      try {
        const fetchRes = await fetch(`${fastApiUrl}/api/analytics`);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          return res.json(data);
        }
      } catch {
        // Fallback
      }
    }

    try {
      const pythonProcess = spawn("python3", [
        "-c",
        "import json; from app.chatbot.rules import ALL_RULES; print(json.dumps({'totalIntentsDefined': len(ALL_RULES), 'ruleMatchRate': 100.0, 'fallbackRate': 0.0, 'status': 'operational'}))"
      ], {
        env: { ...process.env, PYTHONPATH: "backend" },
      });

      let stdout = "";
      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return res.json(parsed);
          } catch {
            return res.status(500).json({ error: "Failed to parse analytics" });
          }
        } else {
          return res.status(500).json({ error: "Failed to load analytics" });
        }
      });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/history", async (_req, res) => {
    const fastApiUrl = process.env.VITE_API_URL || process.env.FASTAPI_URL;
    if (fastApiUrl) {
      try {
        const fetchRes = await fetch(`${fastApiUrl}/api/history`);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          return res.json(data);
        }
      } catch {
        // Fallback
      }
    }

    return res.json({ sessions: [], totalCount: 0 });
  });

  app.post("/api/chat", async (req, res) => {
    const { message, sessionId } = req.body || {};

    if (message === undefined || message === null) {
      return res.status(422).json({
        detail: [{ loc: ["body", "message"], msg: "field required", type: "value_error.missing" }]
      });
    }

    if (typeof message !== "string" || message.trim() === "") {
      return res.status(422).json({
        detail: [{ loc: ["body", "message"], msg: "Input text cannot be empty or whitespace only.", type: "value_error" }]
      });
    }

    // Try FastAPI proxy if FASTAPI_URL or port 8000 is specified
    const fastApiUrl = process.env.FASTAPI_URL;
    if (fastApiUrl) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600);
        const fetchRes = await fetch(`${fastApiUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, sessionId }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (fetchRes.ok) {
          const data = await fetchRes.json();
          return res.json(data);
        }
      } catch {
        // Fallback to local Python runner
      }
    }

    // Execute Python Rule Engine via runner.py
    try {
      const pythonProcess = spawn("python3", ["backend/app/chatbot/runner.py", message, sessionId || ""], {
        env: { ...process.env, PYTHONPATH: "backend" },
      });

      let stdout = "";
      let stderr = "";

      pythonProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code === 0 && stdout.trim()) {
          try {
            const parsed = JSON.parse(stdout.trim());
            return res.json(parsed);
          } catch {
            return res.status(500).json({ error: "Failed to parse Python engine output" });
          }
        } else {
          console.error("Python runner error:", stderr);
          return res.status(500).json({ error: "Python Rule Engine execution error" });
        }
      });
    } catch (err) {
      console.error("Failed to spawn Python runner:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const isHmrDisabled = process.env.DISABLE_HMR === "true";
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`RuleBot Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
