import { NextRequest, NextResponse } from "next/server";
import { generateDomainNames } from "@/lib/gemini";
import { DomainService } from "@/lib/domain";

export interface GenerateRequest {
  audience: string;
  keywords: string;
  tlds: string[];
  language: string;
  budgetLimit: number;
  creativeDirection: string;
}

export interface DomainResult {
  domain: string;
  available: boolean;
  price: number;
  currency: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    if (!body.audience || !body.keywords || !body.tlds?.length || !body.language) {
      return NextResponse.json(
        { error: "Missing required fields: audience, keywords, tlds, language" },
        { status: 400 }
      );
    }

    const budgetLimit = body.budgetLimit || 40;

    // Step 1: Generate domain names via Gemini
    const domainNames = await generateDomainNames({
      audience: body.audience,
      keywords: body.keywords,
      tlds: body.tlds,
      language: body.language,
      creativeDirection: body.creativeDirection,
    });

    // Step 2: Check availability and pricing for each domain
    const domainService = new DomainService();
    const results = await domainService.checkDomains(domainNames);

    // Step 3: Return all results (filtering by budget is done client-side for UX)
    const response: DomainResult[] = results.map((r) => ({
      domain: r.domain,
      available: r.available,
      price: r.price,
      currency: r.currency,
    }));

    return NextResponse.json({
      domains: response,
      budgetLimit,
      totalGenerated: domainNames.length,
    });
  } catch (error) {
    console.error("Domain generation error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
