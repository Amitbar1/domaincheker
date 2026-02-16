import { whoisDomain, firstResult } from "whoiser";

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  price: number;
  currency: string;
}

export interface IDomainChecker {
  check(domain: string): Promise<DomainCheckResult>;
}

const TLD_PRICES: Record<string, number> = {
  ".com": 12,
  ".net": 11,
  ".org": 10,
  ".io": 35,
  ".co": 25,
  ".ai": 45,
  ".trade": 8,
  ".finance": 30,
  ".capital": 28,
  ".fr": 9,
  ".de": 8,
  ".es": 9,
  ".it": 10,
  ".nl": 8,
  ".eu": 7,
  ".uk": 9,
};

function getEstimatedPrice(domain: string): number {
  const tld = domain.substring(domain.lastIndexOf("."));
  return TLD_PRICES[tld] || 15;
}

/**
 * Real domain availability checker using WHOIS (whoiser).
 * Free, no API key needed. Queries public WHOIS servers.
 */
class WhoisChecker implements IDomainChecker {
  async check(domain: string): Promise<DomainCheckResult> {
    try {
      const whoisData = await whoisDomain(domain, { timeout: 5000, follow: 1 });
      const record = firstResult(whoisData);

      const available = this.isAvailable(record);

      return {
        domain,
        available,
        price: getEstimatedPrice(domain),
        currency: "EUR",
      };
    } catch {
      // If WHOIS lookup fails (server unreachable, rate-limited, etc.)
      // treat as "unknown" - mark unavailable so we don't mislead
      return {
        domain,
        available: false,
        price: getEstimatedPrice(domain),
        currency: "EUR",
      };
    }
  }

  private isAvailable(record: ReturnType<typeof firstResult>): boolean {
    if (!record) return true;

    // If there's no "Domain Name" in the WHOIS record, domain is likely available
    if (!record["Domain Name"]) {
      // Also check the raw text for common "not found" patterns
      const rawText = Array.isArray(record.text)
        ? record.text.join(" ").toLowerCase()
        : "";

      // If there's no text at all, or text contains "not found" patterns, it's available
      if (
        !rawText ||
        rawText.includes("no match") ||
        rawText.includes("not found") ||
        rawText.includes("no entries found") ||
        rawText.includes("no data found") ||
        rawText.includes("domain not found") ||
        rawText.includes("status: free") ||
        rawText.includes("status: available")
      ) {
        return true;
      }

      return true;
    }

    // Domain has a WHOIS record with a "Domain Name" - it's taken
    // Double-check Domain Status for edge cases
    const statuses = record["Domain Status"];
    if (Array.isArray(statuses)) {
      const statusStr = statuses.join(" ").toLowerCase();
      if (
        statusStr.includes("no match") ||
        statusStr.includes("free") ||
        statusStr.includes("available")
      ) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Mock domain checker for development/testing without network.
 */
class MockDomainChecker implements IDomainChecker {
  async check(domain: string): Promise<DomainCheckResult> {
    await new Promise((resolve) =>
      setTimeout(resolve, 50 + Math.random() * 100)
    );

    const hash = this.simpleHash(domain);
    const available = hash % 100 < 62;

    return {
      domain,
      available,
      price: getEstimatedPrice(domain),
      currency: "EUR",
    };
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

/**
 * MainReg SOAP API checker - stub for future implementation.
 * Will use the SOAP-based API at soap.subreg.cz with Login + Check_Domain.
 */
class MainRegChecker implements IDomainChecker {
  private apiKey: string;
  private apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async check(domain: string): Promise<DomainCheckResult> {
    // TODO: Implement MainReg SOAP API
    // 1. Login with this.apiKey / this.apiSecret -> get ssid token
    // 2. Check_Domain with ssid + domain -> availability + price
    // 3. For purchases: Make_Order with type=Create_Domain
    console.warn(
      `MainReg SOAP integration pending. Using WHOIS for: ${domain}`,
      this.apiKey,
      this.apiSecret
    );
    const fallback = new WhoisChecker();
    return fallback.check(domain);
  }
}

/**
 * DomainService - orchestrates domain availability checks.
 * Default: real WHOIS lookups via whoiser (free, no API key).
 * If MAINREG credentials are set, uses MainReg SOAP API (future).
 * Checks domains in batches to avoid WHOIS rate-limiting.
 */
export class DomainService {
  private checker: IDomainChecker;
  private concurrency: number;

  constructor() {
    const mainregKey = process.env.MAINREG_API_KEY;
    const mainregSecret = process.env.MAINREG_API_SECRET;
    const useMock = process.env.DOMAIN_CHECKER_MOCK === "true";

    if (useMock) {
      this.checker = new MockDomainChecker();
      this.concurrency = 20;
    } else if (mainregKey && mainregSecret) {
      this.checker = new MainRegChecker(mainregKey, mainregSecret);
      this.concurrency = 5;
    } else {
      this.checker = new WhoisChecker();
      this.concurrency = 3; // Conservative to avoid WHOIS rate-limits
    }
  }

  async checkDomain(domain: string): Promise<DomainCheckResult> {
    return this.checker.check(domain);
  }

  async checkDomains(domains: string[]): Promise<DomainCheckResult[]> {
    const results: DomainCheckResult[] = [];

    // Process in batches to respect rate limits
    for (let i = 0; i < domains.length; i += this.concurrency) {
      const batch = domains.slice(i, i + this.concurrency);
      const batchResults = await Promise.all(
        batch.map((d) => this.checkDomain(d))
      );
      results.push(...batchResults);

      // Small delay between batches to avoid rate-limiting
      if (i + this.concurrency < domains.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    return results;
  }
}
