interface SemanticCreateRequest {
  subject: unknown;

  inputs: Array<"text" | "image" | "audio">;

  output: {
    type: "text" | "json";
    schema?: unknown;
  };

  constraints?: {
    provider?: "native" | "webllm" | "cloud";
    localOnly?: boolean;
    maxTokens?: number;
    maxTurns?: number;
  };
}

interface ValidationResult {
  valid: boolean;
  status: "verified" | "rejected" | "indeterminate";
  errors: string[];
  warnings: string[];
  evidence: Record<string, unknown>;
}
