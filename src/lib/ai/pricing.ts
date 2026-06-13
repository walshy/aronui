export const MODEL_PRICING: Record<string, { inputPerM: number; outputPerM: number }> = {
  'claude-haiku-4-5-20251001': { inputPerM: 1.00, outputPerM: 5.00 },
}

export function computeCost(model: string, inputTokens: number, outputTokens: number): number {
  const p = MODEL_PRICING[model]
  if (!p) return 0
  return (inputTokens / 1e6) * p.inputPerM + (outputTokens / 1e6) * p.outputPerM
}
