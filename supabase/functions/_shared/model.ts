export type ModelConfig = {
  provider: "gemini" | "openai";
  key: string;
  model: string;
};
export function modelConfig(env: (key: string) => string): ModelConfig | null {
  const provider =
    env("WH_AI_PROVIDER") || (env("GEMINI_API_KEY") ? "gemini" : "openai");
  if (provider !== "gemini" && provider !== "openai") return null;
  const key = env(provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY");
  const model = env(provider === "gemini" ? "GEMINI_MODEL" : "OPENAI_MODEL");
  if (!key || !/^[a-zA-Z0-9._-]+$/.test(model)) return null;
  return { provider, key, model };
}
export async function generateProject(
  config: ModelConfig,
  instructions: string,
  prompt: string,
  schema: Record<string, unknown>,
  request: typeof fetch = fetch,
) {
  const gemini = config.provider === "gemini";
  const url = gemini
    ? `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`
    : "https://api.openai.com/v1/responses";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (gemini) headers["x-goog-api-key"] = config.key;
  else headers.Authorization = `Bearer ${config.key}`;
  const body = gemini
    ? {
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 60000,
          responseMimeType: "application/json",
          responseJsonSchema: schema,
        },
      }
    : {
        model: config.model,
        store: false,
        max_output_tokens: 24000,
        text: {
          format: {
            type: "json_schema",
            name: "project",
            strict: true,
            schema,
          },
        },
        input: [
          { role: "system", content: instructions },
          { role: "user", content: prompt },
        ],
      };
  let response!: Response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await request(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    if (response.status !== 503 && response.status !== 429) break;
    if (attempt < 2) await new Promise((r) => setTimeout(r, 2000 * (attempt + 1) + Math.random() * 1000));
  }
  // Provider errors can include credential fragments. Never forward raw bodies.
  if (!response.ok) {
    console.error("provider status", response.status);
    throw new Error(
      response.status === 429
        ? "O provedor de IA atingiu seu limite de uso. Tente novamente mais tarde."
        : response.status === 503
          ? "O Gemini está sobrecarregado agora. Seu crédito foi devolvido; tente de novo em alguns minutos."
          : "O provedor de IA não concluiu a geração. Verifique a configuração do serviço.",
    );
  }
  const result = await response.json();
  let output: string;
  let tokens: number;
  if (gemini) {
    const candidate = result.candidates?.[0];
    if (!candidate || candidate.finishReason !== "STOP")
      throw new Error(
        "A geração ficou incompleta ou foi bloqueada. O crédito será devolvido.",
      );
    output = (candidate.content?.parts || [])
      .filter(
        (part: { text?: string; thought?: boolean }) =>
          typeof part.text === "string" && !part.thought,
      )
      .map((part: { text: string }) => part.text)
      .join("");
    tokens = result.usageMetadata?.totalTokenCount || 0;
  } else {
    if (result.status !== "completed")
      throw new Error("A geração ficou incompleta. O crédito será devolvido.");
    output = (result.output || [])
      .flatMap(
        (item: { content?: { type: string; text?: string }[] }) =>
          item.content || [],
      )
      .filter((part: { type: string }) => part.type === "output_text")
      .map((part: { text: string }) => part.text)
      .join("");
    tokens = result.usage?.total_tokens || 0;
  }
  if (!output.trim())
    throw new Error("A IA não retornou os arquivos do projeto.");
  let artifact: unknown;
  try {
    artifact = JSON.parse(output);
  } catch {
    throw new Error(
      "A IA retornou um projeto inválido. O crédito será devolvido.",
    );
  }
  return { artifact, tokens, model: `${config.provider}/${config.model}` };
}
