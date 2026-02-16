import { whoisDomain, firstResult } from "whoiser";

const domains = [
  "google.com",            // Should be TAKEN
  "facebook.com",          // Should be TAKEN
  "xyzqwerty98765.com",   // Should be AVAILABLE (random gibberish)
  "asdkjh3kj2h3kj.io",   // Should be AVAILABLE (random gibberish)
];

console.log("Testing WHOIS domain availability checker...\n");

for (const domain of domains) {
  try {
    const whoisData = await whoisDomain(domain, { timeout: 5000, follow: 1 });
    const record = firstResult(whoisData);

    const domainName = record?.["Domain Name"];
    const hasRecord = !!domainName;

    const rawText = Array.isArray(record?.text) ? record.text.join(" ").toLowerCase() : "";
    const notFoundPattern = rawText.includes("no match") || rawText.includes("not found") || rawText.includes("no entries found");

    const available = !hasRecord || notFoundPattern;

    console.log(`${available ? "✅ AVAILABLE" : "❌ TAKEN"}  ${domain}`);
    if (hasRecord) {
      console.log(`   WHOIS Domain Name: ${domainName}`);
    }
    if (notFoundPattern) {
      console.log(`   Raw text indicates: not found`);
    }
  } catch (err) {
    console.log(`⚠️  ERROR    ${domain} - ${err.message}`);
  }
  console.log();
}
