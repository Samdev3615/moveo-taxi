import { google } from "googleapis";

function getAuth() {
  const client = new google.auth.OAuth2(
    process.env.GSC_CLIENT_ID,
    process.env.GSC_CLIENT_SECRET,
  );
  client.setCredentials({
    refresh_token: process.env.GSC_REFRESH_TOKEN,
  });
  return client;
}

const SITE_URL = "https://www.moveotaxi.com/";

function dateRange(days: number) {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}

export async function getTopQueries(days = 28, limit = 20) {
  const sc = google.searchconsole({ version: "v1", auth: getAuth() });
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      ...dateRange(days),
      dimensions: ["query"],
      rowLimit: limit,
    },
  });
  return res.data.rows ?? [];
}

export async function getTopPages(days = 28, limit = 15) {
  const sc = google.searchconsole({ version: "v1", auth: getAuth() });
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      ...dateRange(days),
      dimensions: ["page"],
      rowLimit: limit,
    },
  });
  return res.data.rows ?? [];
}

export async function getCountries(days = 28) {
  const sc = google.searchconsole({ version: "v1", auth: getAuth() });
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      ...dateRange(days),
      dimensions: ["country"],
      rowLimit: 10,
    },
  });
  return res.data.rows ?? [];
}

export async function getDevices(days = 28) {
  const sc = google.searchconsole({ version: "v1", auth: getAuth() });
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      ...dateRange(days),
      dimensions: ["device"],
      rowLimit: 5,
    },
  });
  return res.data.rows ?? [];
}

export function formatGscData(rows: { keys?: string[] | null; clicks?: number | null; impressions?: number | null; ctr?: number | null; position?: number | null }[]) {
  return rows
    .map((r) => `${r.keys?.[0] ?? ""} | clics: ${r.clicks ?? 0} | impressions: ${r.impressions ?? 0} | CTR: ${((r.ctr ?? 0) * 100).toFixed(1)}% | position: ${(r.position ?? 0).toFixed(1)}`)
    .join("\n");
}
