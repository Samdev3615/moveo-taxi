import { google } from "googleapis";

const PROPERTY_ID = `properties/${process.env.GA4_PROPERTY_ID}`;

function getAuth() {
  const client = new google.auth.OAuth2(
    process.env.GSC_CLIENT_ID,
    process.env.GSC_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.GA4_REFRESH_TOKEN });
  return client;
}

function dateRange(days: number) {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

async function runReport(days: number, metrics: string[], dimensions: string[], rowLimit = 15) {
  const analyticsData = google.analyticsdata({ version: "v1beta", auth: getAuth() });
  const { startDate, endDate } = dateRange(days);
  const res = await analyticsData.properties.runReport({
    property: PROPERTY_ID,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: metrics.map((m) => ({ name: m })),
      dimensions: dimensions.map((d) => ({ name: d })),
      limit: String(rowLimit),
      orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
    },
  });
  return res.data.rows ?? [];
}

export async function getGa4Overview(days = 28) {
  const analyticsData = google.analyticsdata({ version: "v1beta", auth: getAuth() });
  const { startDate, endDate } = dateRange(days);
  const res = await analyticsData.properties.runReport({
    property: PROPERTY_ID,
    requestBody: {
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
      dimensions: [],
    },
  });
  const row = res.data.rows?.[0]?.metricValues;
  if (!row) return null;
  return {
    sessions: Number(row[0]?.value ?? 0),
    users: Number(row[1]?.value ?? 0),
    pageviews: Number(row[2]?.value ?? 0),
    bounceRate: Math.round(Number(row[3]?.value ?? 0) * 100),
    avgDurationSec: Math.round(Number(row[4]?.value ?? 0)),
  };
}

export async function getGa4TopPages(days = 28, limit = 15) {
  return runReport(days, ["sessions", "activeUsers", "bounceRate"], ["pagePath"], limit);
}

export async function getGa4TrafficSources(days = 28) {
  return runReport(days, ["sessions", "activeUsers"], ["sessionDefaultChannelGroup"], 8);
}

export async function getGa4Countries(days = 28) {
  return runReport(days, ["sessions", "activeUsers"], ["country"], 10);
}

export function formatGa4Overview(data: Awaited<ReturnType<typeof getGa4Overview>>) {
  if (!data) return "[GA4 non disponible]";
  const dur = `${Math.floor(data.avgDurationSec / 60)}m${data.avgDurationSec % 60}s`;
  return `Sessions: ${data.sessions} | Utilisateurs: ${data.users} | Pages vues: ${data.pageviews} | Rebond: ${data.bounceRate}% | Durée moy: ${dur}`;
}

export function formatGa4Rows(
  rows: { dimensionValues?: { value?: string | null }[]; metricValues?: { value?: string | null }[] }[],
  metricNames: string[],
) {
  return rows
    .map((r) => {
      const dim = r.dimensionValues?.map((d) => d.value ?? "").join(", ") ?? "";
      const metrics = metricNames.map((m, i) => `${m}: ${r.metricValues?.[i]?.value ?? 0}`).join(" | ");
      return `${dim} | ${metrics}`;
    })
    .join("\n");
}
