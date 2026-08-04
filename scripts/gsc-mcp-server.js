#!/usr/bin/env node
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const TOKEN_PATH = path.join(__dirname, "../.gsc-token.json");
const ENV_PATH = path.join(__dirname, "../.env.local");
const SITE_URL = "https://www.moveotaxi.com/";

function readEnv() {
  return fs.readFileSync(ENV_PATH, "utf8").split("\n").reduce((acc, line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) acc[m[1].trim()] = m[2].trim();
    return acc;
  }, {});
}

function getAuth() {
  const env = readEnv();
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const auth = new google.auth.OAuth2(env.GSC_CLIENT_ID, env.GSC_CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
  auth.setCredentials(tokens);
  auth.on("tokens", (t) => {
    if (t.refresh_token) {
      const updated = { ...tokens, ...t };
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated, null, 2));
    }
  });
  return auth;
}

async function gscSearchAnalytics({ startDate, endDate, dimensions = ["query"], rowLimit = 25 }) {
  const sc = google.webmasters({ version: "v3", auth: getAuth() });
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions, rowLimit },
  });
  return res.data.rows ?? [];
}

async function gscListPages() {
  const sc = google.webmasters({ version: "v3", auth: getAuth() });
  const res = await sc.sitemaps.list({ siteUrl: SITE_URL });
  return res.data.sitemap ?? [];
}

const TOOLS = [
  {
    name: "gsc_search_analytics",
    description: "Query Google Search Console search analytics for moveotaxi.com. Returns clicks, impressions, CTR, position.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Start date YYYY-MM-DD" },
        endDate: { type: "string", description: "End date YYYY-MM-DD" },
        dimensions: { type: "array", items: { type: "string" }, description: "Dimensions: query, page, country, device" },
        rowLimit: { type: "number", description: "Max rows (default 25)" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "gsc_list_sitemaps",
    description: "List sitemaps submitted to Google Search Console for moveotaxi.com.",
    inputSchema: { type: "object", properties: {} },
  },
];

async function callTool(name, args) {
  if (name === "gsc_search_analytics") return await gscSearchAnalytics(args);
  if (name === "gsc_list_sitemaps") return await gscListPages();
  throw new Error(`Unknown tool: ${name}`);
}

// MCP JSON-RPC server over stdio
const rl = readline.createInterface({ input: process.stdin, terminal: false });
const respond = (obj) => process.stdout.write(JSON.stringify(obj) + "\n");

rl.on("line", async (line) => {
  let msg;
  try { msg = JSON.parse(line); } catch { return; }
  const { id, method, params } = msg;

  if (method === "initialize") {
    respond({ jsonrpc: "2.0", id, result: {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {} },
      serverInfo: { name: "gsc-moveo", version: "1.0.0" },
    }});
  } else if (method === "notifications/initialized") {
    // no response needed
  } else if (method === "tools/list") {
    respond({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  } else if (method === "tools/call") {
    try {
      const data = await callTool(params.name, params.arguments ?? {});
      respond({ jsonrpc: "2.0", id, result: {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      }});
    } catch (err) {
      respond({ jsonrpc: "2.0", id, result: {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      }});
    }
  } else {
    respond({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
  }
});
