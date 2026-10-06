// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  generateProject,
  modelConfig,
} from "../../supabase/functions/_shared/model";
const env = (values: Record<string, string>) => (key: string) =>
  values[key] || "";
describe("builder model providers", () => {
  it("selects Gemini when configured and preserves an explicit provider", () => {
    const values = {
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "gemini-test",
      OPENAI_API_KEY: "other-key",
      OPENAI_MODEL: "test-model",
    };
    expect(modelConfig(env(values))?.provider).toBe("gemini");
    expect(
      modelConfig(env({ ...values, WH_AI_PROVIDER: "openai" }))?.provider,
    ).toBe("openai");
    expect(modelConfig(env({ GEMINI_API_KEY: "key" }))).toBeNull();
    expect(
      modelConfig(env({ ...values, GEMINI_MODEL: "../invalid" })),
    ).toBeNull();
  });
  it("sends Google structured output and excludes reasoning parts", async () => {
    const request: typeof fetch = async (input, options) => {
      expect(String(input)).toBe(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-test:generateContent",
      );
      expect(new Headers(options?.headers).get("x-goog-api-key")).toBe(
        "test-key",
      );
      expect(String(input)).not.toContain("test-key");
      const body = JSON.parse(options?.body as string);
      expect(body.systemInstruction.parts[0].text).toBe("instructions");
      expect(body.generationConfig.responseFormat.text.mimeType).toBe(
        "application/json",
      );
      return Response.json({
        candidates: [
          {
            finishReason: "STOP",
            content: {
              parts: [
                { thought: true, text: "internal reasoning" },
                { text: '{"files":[]}' },
              ],
            },
          },
        ],
        usageMetadata: { totalTokenCount: 23 },
      });
    };
    const result = await generateProject(
      { provider: "gemini", key: "test-key", model: "gemini-test" },
      "instructions",
      "prompt",
      { type: "object" },
      request,
    );
    expect(result.artifact).toEqual({ files: [] });
    expect(result.tokens).toBe(23);
    expect(result.model).toBe("gemini/gemini-test");
  });
  it("rejects incomplete output, invalid JSON and provider errors without leaking keys", async () => {
    const config = {
      provider: "gemini" as const,
      key: "secret",
      model: "gemini-test",
    };
    await expect(
      generateProject(config, "", "", {}, async () =>
        Response.json({ candidates: [{ finishReason: "MAX_TOKENS" }] }),
      ),
    ).rejects.toThrow("incompleta");
    await expect(
      generateProject(config, "", "", {}, async () =>
        Response.json({
          candidates: [
            {
              finishReason: "STOP",
              content: { parts: [{ text: "broken JSON" }] },
            },
          ],
        }),
      ),
    ).rejects.toThrow("inválido");
    await expect(
      generateProject(
        config,
        "",
        "",
        {},
        async () => new Response("secret", { status: 401 }),
      ),
    ).rejects.toThrow("Verifique a configuração");
  });
  it("retains the OpenAI Responses integration", async () => {
    const result = await generateProject(
      { provider: "openai", key: "test-key", model: "test-model" },
      "",
      "",
      {},
      async (input, options) => {
        expect(String(input)).toContain("/v1/responses");
        expect(new Headers(options?.headers).get("authorization")).toBe(
          "Bearer test-key",
        );
        return Response.json({
          status: "completed",
          output: [
            { content: [{ type: "output_text", text: '{"files":[]}' }] },
          ],
          usage: { total_tokens: 12 },
        });
      },
    );
    expect(result.tokens).toBe(12);
    expect(result.model).toBe("openai/test-model");
  });
});
