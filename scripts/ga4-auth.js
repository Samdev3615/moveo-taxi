#!/usr/bin/env node
/**
 * One-time OAuth2 flow to get a GA4 refresh token.
 * Run: node scripts/ga4-auth.js
 */
const { google } = require("googleapis");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env.local");
const envVars = fs.readFileSync(envPath, "utf8").split("\n").reduce((acc, line) => {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) acc[m[1].trim()] = m[2].trim();
  return acc;
}, {});

const CLIENT_ID = envVars.GSC_CLIENT_ID;
const CLIENT_SECRET = envVars.GSC_CLIENT_SECRET;
const TOKEN_PATH = path.join(__dirname, "../.ga4-token.json");
const MEASUREMENT_ID = "G-FZTXM5V6G5";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/analytics.readonly"],
  prompt: "consent",
});

console.log("\n=== Autorisation Google Analytics 4 ===\n");
console.log("1. Ouvrez ce lien dans Chrome :\n");
console.log(authUrl);
console.log("\n2. Connectez-vous avec le compte Google de Moveo Taxi");
console.log("3. Copiez le code et collez-le ci-dessous\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question("Collez le code ici : ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    oauth2Client.setCredentials(tokens);

    console.log("\nRecherche de ta propriété GA4...");

    // Discover GA4 property ID via Admin API
    const admin = google.analyticsadmin({ version: "v1beta", auth: oauth2Client });
    const summariesRes = await admin.accountSummaries.list();
    const accountSummaries = summariesRes.data.accountSummaries ?? [];

    let propertyId = null;
    for (const account of accountSummaries) {
      for (const propSummary of (account.propertySummaries ?? [])) {
        try {
          const streamsRes = await admin.properties.dataStreams.list({ parent: propSummary.property });
          const streams = streamsRes.data.dataStreams ?? [];
          const match = streams.find((s) => s.webStreamData?.measurementId === MEASUREMENT_ID);
          if (match) {
            propertyId = propSummary.property.replace("properties/", "");
            console.log(`✅ Propriété trouvée : ${propSummary.displayName} (ID: ${propertyId})`);
            break;
          }
        } catch {}
      }
      if (propertyId) break;
    }

    if (!propertyId) {
      console.log("\n⚠️  Propriété non trouvée automatiquement.");
      console.log("Propriétés accessibles :");
      accountSummaries.forEach((a) =>
        (a.propertySummaries ?? []).forEach((p) => console.log(` - ${p.displayName} : ${p.property}`))
      );
      console.log('\nCopie l\'ID numérique et ajoute GA4_PROPERTY_ID=XXXXXXXXX dans .env.local');
    }

    const tokenData = { ...tokens, property_id: propertyId };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
    console.log("\n✅ Token sauvegardé dans .ga4-token.json");
    console.log("Refresh token :", tokens.refresh_token ? "OK ✅" : "MANQUANT ❌");

  } catch (err) {
    console.error("Erreur :", err.message);
  }
});
