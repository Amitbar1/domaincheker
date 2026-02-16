import { GoogleGenerativeAI } from "@google/generative-ai";

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  English:
    "Generate names that resonate with English-speaking audiences. Use strong, modern English words or coined terms.",
  French:
    "Generate names that resonate with French-speaking audiences. Consider using elegant French words, phonetics, or Franco-inspired coined terms that feel sophisticated.",
  German:
    "Generate names that resonate with German-speaking audiences. Consider using strong, precise German words or Germanic-inspired coined terms that convey reliability.",
  Spanish:
    "Generate names that resonate with Spanish-speaking audiences. Consider using dynamic Spanish words or Iberian-inspired coined terms that feel energetic.",
  Arabic:
    "Generate names that resonate with Arabic-speaking audiences. Consider using transliterated Arabic words or Middle-Eastern-inspired coined terms that convey trust and prosperity.",
  Portuguese:
    "Generate names that resonate with Portuguese-speaking audiences. Consider using vibrant Portuguese words or Lusophone-inspired coined terms.",
  Italian:
    "Generate names that resonate with Italian-speaking audiences. Consider using elegant Italian words or Italian-inspired coined terms that feel premium.",
  Dutch:
    "Generate names that resonate with Dutch-speaking audiences. Consider using direct, clear Dutch words or Dutch-inspired coined terms.",
  Japanese:
    "Generate names that resonate with Japanese-speaking audiences. Consider using romanized Japanese words (romaji) or Japan-inspired coined terms that feel innovative.",
};

export interface GenerateNamesParams {
  audience: string;
  keywords: string;
  tlds: string[];
  language: string;
  creativeDirection?: string;
}

export async function generateDomainNames(
  params: GenerateNamesParams
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const languageInstruction =
    LANGUAGE_INSTRUCTIONS[params.language] || LANGUAGE_INSTRUCTIONS["English"];

  const tldList = params.tlds.join(", ");
  const namesPerTld = Math.max(5, Math.floor(20 / params.tlds.length));
  const totalNames = namesPerTld * params.tlds.length;

  const prompt = `You are a world-class brand naming expert specializing in the financial trading industry.

TASK: Generate exactly ${totalNames} creative, professional, and brandable domain names for a trading company.

CONTEXT:
- Target audience: ${params.audience}
- Industry keywords: ${params.keywords}
- Domain extensions to use: ${tldList}
- Language/Market: ${params.language}

LANGUAGE GUIDANCE:
${languageInstruction}

${params.creativeDirection ? `CREATIVE DIRECTION FROM THE USER (follow this closely):\n${params.creativeDirection}\n\n` : ""}BRAND REQUIREMENTS:
- Names must evoke TRUST, SPEED, MODERNITY, and PROFESSIONALISM
- Names should be suitable for a financial trading brand (FX, Crypto, Stocks, etc.)
- Names must be short (ideally 6-14 characters before the TLD)
- Names must be easy to pronounce, spell, and remember
- Mix of approaches: coined words, compound words, metaphors, and abstract names
- Avoid names that are generic, offensive, or already well-known brands
- Generate approximately ${namesPerTld} names for EACH of these extensions: ${tldList}
- Each name MUST end with one of the provided extensions

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly ${totalNames} domain name strings, nothing else.
Example: ["example.com", "another.net"]

Generate the ${totalNames} domain names now:`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text().trim();

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Gemini response as JSON array");
  }

  const names: string[] = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(names) || names.length === 0) {
    throw new Error("Gemini returned an empty or invalid array");
  }

  return names
    .map((name) => name.toLowerCase().replace(/\s+/g, ""))
    .slice(0, totalNames);
}
