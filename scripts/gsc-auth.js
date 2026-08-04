#!/usr/bin/env node
/**
 * One-time OAuth2 flow to get a GSC refresh token.
 * Run: node scripts/gsc-auth.js
 */
const { google } = require("googleapis");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Read .env.local manually
const envPath = path.join(__dirname, "../.env.local");
const envVars = fs.readFileSync(envPath, "utf8").split("\n").reduce((acc, line) => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) acc[m[1].trim()] = m[2].trim();
  return acc;
}, {});

const CLIENT_ID = envVars.GSC_CLIENT_ID;
const CLIENT_SECRET = envVars.GSC_CLIENT_SECRET;
const TOKEN_PATH = path.join(__dirname, "../.gsc-token.json");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "urn:ietf:wg:oauth:2.0:oob"
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/webmasters.readonly"],
  prompt: "consent",
});

console.log("\n=== Autorisation Google Search Console ===\n");
console.log("1. Ouvrez ce lien dans Chrome :\n");
console.log(authUrl);
console.log("\n2. Connectez-vous avec le compte Google de Moveo Taxi");
console.log("3. Copiez le code et collez-le ci-dessous\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Collez le code ici : ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log("\n✅ Token sauvegardé dans .gsc-token.json");
    console.log("Refresh token:", tokens.refresh_token ? "OK" : "MANQUANT");

    // Test
    oauth2Client.setCredentials(tokens);
    const sc = google.webmasters({ version: "v3", auth: oauth2Client });
    const sites = await sc.sites.list();
    console.log("\nSites GSC accessibles :");
    sites.data.siteEntry?.forEach((s) => console.log(" -", s.siteUrl, s.permissionLevel));
  } catch (err) {
    console.error("Erreur :", err.message);
  }
});
