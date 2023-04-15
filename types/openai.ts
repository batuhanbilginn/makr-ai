export type ChatGPTAgent = "user" | "system" | "assistant";

export interface OpenAIKeyOptional {
  action: "remove" | "get";
  key?: string;
}

export interface OpenAIKeyRequired {
  action: "set";
  key: string;
}

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  apiKey: string;
  model: "gpt-3.5-turbo" | "gpt-4";
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export interface OpenAISettings {
  model: "gpt-3.5-turbo" | "gpt-4";
  history_type: "chat" | "global";
  system_prompt: string;
  advanced_settings: {
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
    stream: boolean;
    n: number;
  };
}
