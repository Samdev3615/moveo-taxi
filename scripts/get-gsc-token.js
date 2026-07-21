// Script pour obtenir le refresh token Google Search Console
// Usage: node scripts/get-gsc-token.js client_secret_XXXX.json

const fs = require("fs");
const https = require("https");
const readline = require("readline");

const credFile = process.argv[2];
if (!credFile) {
  console.error("Usage: node scripts/get-gsc-token.js <chemin-vers-client_secret.json>");
  process.exit(1);
}

const creds = JSON.parse(fs.readFileSync(credFile, "utf8"));
const { client_id, client_secret } = creds.installed || creds.web;

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const REDIRECT = "urn:ietf:wg:oauth:2.0:oob";

const authUrl =
  `https://accounts.google.com/o/oauth2/auth?` +
  `client_id=${client_id}&` +
  `redirect_uri=${encodeURIComponent(REDIRECT)}&` +
  `response_type=code&` +
  `scope=${encodeURIComponent(SCOPE)}&` +
  `access_type=offline&` +
  `prompt=consent`;

console.log("\n=== ÉTAPE 1 ===");
console.log("Ouvre ce lien dans ton navigateur et autorise l'accès :\n");
console.log(authUrl);
console.log("\n=== ÉTAPE 2 ===");
console.log("Copie le code affiché par Google et colle-le ici :\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Code d'autorisation : ", (code) => {
  rl.close();

  const body = new URLSearchParams({
    code: code.trim(),
    client_id,
    client_secret,
    redirect_uri: REDIRECT,
    grant_type: "authorization_code",
  }).toString();

  const options = {
    hostname: "oauth2.googleapis.com",
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body),
    },
  };

  const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const tokens = JSON.parse(data);
      if (tokens.error) {
        console.error("\nErreur:", tokens.error_description);
        return;
      }
      console.log("\n=== SUCCÈS ===");
      console.log("Ajoute ces variables sur Vercel :\n");
      console.log(`GSC_CLIENT_ID=${client_id}`);
      console.log(`GSC_CLIENT_SECRET=${client_secret}`);
      console.log(`GSC_REFRESH_TOKEN=${tokens.refresh_token}`);
    });
  });

  req.on("error", console.error);
  req.write(body);
  req.end();
});
