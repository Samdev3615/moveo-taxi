import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODEL_HAIKU = "claude-haiku-4-5-20251001";
export const MODEL_SONNET = "claude-sonnet-5";

export const MODEL = MODEL_HAIKU;

// Temporary kill switch for the AI SEO agents (crons + manual triggers).
// Set to false to resume them.
export const AGENTS_PAUSED = true;
