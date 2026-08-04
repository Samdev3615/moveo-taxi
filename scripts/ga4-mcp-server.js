#!/usr/bin/env node
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const TOKEN_PATH = path.join(__dirname, "../.ga4-token.json");
const ENV_PATH = path.join(__dirname, "../.env.local");

function readEnv() {
  return fs.readFileSync(ENV_PATH, "utf8").split("\n").reduce((acc, line) => {
    const m = line.match(/^([^#=]+)=(.*)/);
    if (m) acc[m[1].trim()] = m[2].trim();
    return acc;
  }, {});
}

function getAuth() {
  const env = readEnv();
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
  const auth = new google.auth.OAuth2(env.GSC_CLIENT_ID, env.GSC_CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");
  auth.setCredentials(tokenData);
  auth.on("tokens", (t) => {
    if (t.refresh_token) {
      fs.writeFileSync(TOKEN_PATH, JSON.stringify({ ...tokenData, ...t }, null, 2));
    }
  });
  const propertyId = tokenData.property_id || env.GA4_PROPERTY_ID;
  return { auth, property: `properties/${propertyId}` };
}

async function runReport({ startDate, endDate, metrics, dimensions = [], rowLimit = 25 }) {
  const { auth, property } = getAuth();
  const analyticsData = google.analyticsdata({ version: "v1beta", auth });
  const res = await analyticsData.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: dimensions.map((d) => ({ name: d })),
      limit: rowLimit,
      orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
    },
  });
  return res.data;
}

const TOOLS = [
  {
    name: "ga4_traffic_overview",
    description: "Vue d'ensemble du trafic moveotaxi.com : sessions, utilisateurs, pages vues, durée de session.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Date de début YYYY-MM-DD" },
        endDate: { type: "string", description: "Date de fin YYYY-MM-DD" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "ga4_top_pages",
    description: "Pages les plus visitées sur moveotaxi.com avec sessions et taux de rebond.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Date de début YYYY-MM-DD" },
        endDate: { type: "string", description: "Date de fin YYYY-MM-DD" },
        rowLimit: { type: "number", description: "Nombre max de lignes (défaut 25)" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "ga4_traffic_sources",
    description: "Répartition du trafic par source : organique Google, direct, réseaux sociaux, referral.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Date de début YYYY-MM-DD" },
        endDate: { type: "string", description: "Date de fin YYYY-MM-DD" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "ga4_by_country",
    description: "Trafic par pays sur moveotaxi.com.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Date de début YYYY-MM-DD" },
        endDate: { type: "string", description: "Date de fin YYYY-MM-DD" },
      },
      required: ["startDate", "endDate"],
    },
  },
  {
    name: "ga4_by_language",
    description: "Trafic par langue du navigateur — utile pour voir quelle version linguistique du site performe.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: { type: "string", description: "Date de début YYYY-MM-DD" },
        endDate: { type: "string", description: "Date de fin YYYY-MM-DD" },
      },
      required: ["startDate", "endDate"],
    },
  },
];

async function callTool(name, args) {
  if (name === "ga4_traffic_overview") {
    return await runReport({
      startDate: args.startDate,
      endDate: args.endDate,
      metrics: ["sessions", "activeUsers", "screenPageViews", "bounceRate", "averageSessionDuration"],
      dimensions: [],
    });
  }
  if (name === "ga4_top_pages") {
    return await runReport({
      startDate: args.startDate,
      endDate: args.endDate,
      metrics: ["sessions", "activeUsers", "bounceRate"],
      dimensions: ["pagePath"],
      rowLimit: args.rowLimit ?? 25,
    });
  }
  if (name === "ga4_traffic_sources") {
    return await runReport({
      startDate: args.startDate,
      endDate: args.endDate,
      metrics: ["sessions", "activeUsers"],
      dimensions: ["sessionDefaultChannelGroup"],
      rowLimit: 10,
    });
  }
  if (name === "ga4_by_country") {
    return await runReport({
      startDate: args.startDate,
      endDate: args.endDate,
      metrics: ["sessions", "activeUsers"],
      dimensions: ["country"],
      rowLimit: 15,
    });
  }
  if (name === "ga4_by_language") {
    return await runReport({
      startDate: args.startDate,
      endDate: args.endDate,
      metrics: ["sessions", "activeUsers"],
      dimensions: ["language"],
      rowLimit: 15,
    });
  }
  throw new Error(`Unknown tool: ${name}`);
}

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
      serverInfo: { name: "ga4-moveo", version: "1.0.0" },
    }});
  } else if (method === "notifications/initialized") {
    // no response
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
