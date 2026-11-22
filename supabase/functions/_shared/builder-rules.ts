export const CREDIT_PACKAGES = {
  inicial: { credits: 5, amount: 1000, name: "Inicial" },
  criador: { credits: 15, amount: 2500, name: "Criador" },
  pro: { credits: 40, amount: 5900, name: "Pro" },
} as const;
export function validPrompt(prompt: unknown): prompt is string {
  return typeof prompt === "string" && prompt.trim().length >= 10 && prompt.length <= 6000;
}
export function canGenerate(prompt: string, pending: boolean, signedIn: boolean, walletAvailable: boolean, balance: number) {
  return validPrompt(prompt) && !pending && (!signedIn || (walletAvailable && balance >= 1));
}