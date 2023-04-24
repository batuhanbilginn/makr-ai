import { ChatWithMessageCountAndSettings, MessageT } from "@/types/collections";
import {
  ChatGPTMessage,
  OpenAIKeyOptional,
  OpenAIKeyRequired,
  OpenAISettings,
  OpenAIStreamPayload,
} from "@/types/openai";
import { encode } from "@nem035/gpt-3-encoder";
import { atom } from "jotai";
import { createRef } from "react";
import { v4 as uuidv4 } from "uuid";

// Current Prices of GPT Models per 1000 tokens
const modelPrices = {
  "gpt-3.5-turbo": 0.002 / 1000,
  "gpt-4": 0.03 / 1000,
};
export const defaultSystemPropmt = `You are makr.AI, a large language model trained by OpenAI.`;

// To hold OpenAI API Key
export const openAIAPIKeyAtom = atom<string>(process.env.OPENAI_API_KEY || "");

// To control OpenAI API Key (Set and Delete)
export const openAPIKeyHandlerAtom = atom(
  (get) => get(openAIAPIKeyAtom),
  (_get, set, payload: OpenAIKeyOptional | OpenAIKeyRequired) => {
    if (payload.action === "remove") {
      set(openAIAPIKeyAtom, "");
      localStorage.removeItem("openai-api-key");
    } else if (payload.action === "set") {
      set(openAIAPIKeyAtom, payload.key);
      localStorage.setItem("openai-api-key", payload.key);
    } else if (payload.action === "get") {
      // Check ENV first
      const localKey = localStorage.getItem("openai-api-key");
      if (localKey) {
        set(openAIAPIKeyAtom, localKey);
      }
    }
  }
);

// To control OpenAI Settings when starting new chat (New Chat Component)
export const openAISettingsAtom = atom<OpenAISettings>({
  model: "gpt-3.5-turbo",
  history_type: "chat",
  system_prompt: defaultSystemPropmt,
  advanced_settings: {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  },
});

// To combine all settings and messages in a state for sending new message (Read Only)
const openAIPayload = atom<OpenAIStreamPayload>((get) => {
  const currentChat = get(currentChatAtom);
  const tokenSizeLimitState = get(tokenSizeLimitAtom);
  // Check if global history is enabled
  const isContextNeeded =
    get(historyTypeAtom) === "global" || tokenSizeLimitState.isBeyondLimit;
  // Remove the empty assitant message before sending (There is a empty emssage that we push to state for UX purpose)
  const messages = [...get(messagesAtom)].filter(
    (message) => message.content !== ""
  );
  let history = messages;

  // CONTEXT IS NEEDED
  if (isContextNeeded) {
    // Get the context based on search
    const context = get(previousContextAtom);
    // Remaining Token for Current Chat History
    let remainingTokenSizeForCurrentChat =
      tokenSizeLimitState.remainingTokenForCurerntChat;

    // Get old messages of current chat based on remaining token size
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const messageTokenSize = encode(message.content as string).length;
      if (messageTokenSize > remainingTokenSizeForCurrentChat) {
        messages.splice(i, 1);
      } else {
        remainingTokenSizeForCurrentChat -= messageTokenSize;
      }
    }
    history = messages.map((message, index, array) => {
      // Put Context in the last user's message
      if (index === array.length - 1) {
        return {
          content: `Previous Conversations Context:${JSON.stringify(
            context
          )} \n\n ${message.content}`,
          role: message.role,
        } as MessageT;
      } else {
        return message;
      }
    });
  }

  return {
    apiKey: get(openAIAPIKeyAtom),
    model: currentChat?.model ?? "gpt-3.5-turbo",
    messages: [
      {
        content:
          currentChat?.system_prompt!! +
          `Answer as concisely as possible and ALWAYS answer in MARKDOWN. Answer based on previous conversations if provided and if it's relevant. Current date: ${new Date()}`,
        role: "system",
      },
      ...history.map(
        (m) =>
          ({
            content: m.content as string,
            role: m.role ?? "user",
          } as ChatGPTMessage)
      ),
    ],
    ...currentChat?.advanced_settings!!,
  };
});

// To control handling state of add message logic
const handlingAtom = atom<boolean>(false);
// Chatbox Ref for controlling scroll
export const chatboxRefAtom = atom(createRef<HTMLDivElement>());
// Chat Input
export const inputAtom = atom<string>("");

export const ownerIDAtom = atom<string>("");
// Where we keep current chat ID - (Read Only)
export const chatIDAtom = atom<string>((get) => get(currentChatAtom)?.id ?? "");
// Where we keep current chat
export const currentChatAtom = atom<null | ChatWithMessageCountAndSettings>(
  null
);
export const chatsAtom = atom<ChatWithMessageCountAndSettings[]>([]);
// Where we keep all the messages
export const messagesAtom = atom<MessageT[]>([]);
// To check if chat has messages (Read Only)
export const currentChatHasMessagesAtom = atom<boolean>(
  (get) => get(messagesAtom).length > 0
);

// Token Calculations
export const tokenCountAtom = atom((get) => {
  const currentModel = get(currentChatAtom)?.model ?? "gpt-3.5-turbo";
  const currentMessage = get(inputAtom);

  const currentMessageToken = encode(currentMessage).length;
  const currentMessagePrice =
    currentMessageToken * modelPrices[currentModel] + "$";
  const currentChatToken =
    get(messagesAtom).reduce((curr, arr) => {
      return curr + encode(arr.content as string).length;
    }, 0) + currentMessageToken;
  const currentChatPrice = currentChatToken * modelPrices[currentModel] + "$";

  return {
    currentMessageToken,
    currentMessagePrice,
    currentChatToken,
    currentChatPrice,
  };
});

export const tokenSizeLimitAtom = atom((get) => {
  const limit = 4000; // TODO: Change this based on the model.
  const responseLimit =
    get(currentChatAtom)?.advanced_settings?.max_tokens ?? 1000;
  const systemPropmtTokenSize =
    encode(get(currentChatAtom)?.system_prompt ?? "").length + 90; // 90 is for static text we provided for the sake of this app.
  const buffer = 250; // Buffer TODO: Find a proper solution
  // Calcula the context token size
  const contextTokenSize = encode(
    JSON.stringify(get(previousContextAtom))
  ).length;
  const total =
    limit - systemPropmtTokenSize - buffer - responseLimit - contextTokenSize;

  return {
    remainingToken: total - get(tokenCountAtom).currentChatToken,
    remainingTokenForCurerntChat: total,
    isBeyondLimit: total <= get(tokenCountAtom).currentChatToken,
  };
});
// Read Only atom for getting history type state
export const historyTypeAtom = atom<"global" | "chat">(
  (get) => get(currentChatAtom)?.history_type ?? "chat"
);

// To hold context that we get from similarity search
const previousContextAtom = atom<MessageT[]>([]);

// Abort Controller for OpenAI Stream
const abortControllerAtom = atom<AbortController>(new AbortController());
export const cancelHandlerAtom = atom(
  (get) => get(handlingAtom),
  (get, set) => {
    const abortController = get(abortControllerAtom);
    abortController.abort();
    set(handlingAtom, false);
    set(abortControllerAtom, new AbortController());
  }
);

// Add Message Handler
export const addMessageAtom = atom(
  (get) => get(handlingAtom),
  async (get, set, action: "generate" | "regenerate" = "generate") => {
    const inputValue = get(inputAtom);
    const token_size = get(tokenCountAtom).currentMessageToken;
    const isHandlig = get(handlingAtom);
    const chatID = get(chatIDAtom);
    const currentChat = get(currentChatAtom);
    const apiKey = get(openAIAPIKeyAtom);
    // Early Returns
    if (
      isHandlig ||
      (inputValue.length < 2 && action !== "regenerate") ||
      !apiKey
    ) {
      return;
    }

    // Build User's Message Object in Function Scope - We need to use it in multiple places
    const userMessage: MessageT = {
      content: inputValue,
      role: "user",
      chat: chatID!!,
      id: uuidv4(),
      created_at: String(new Date()),
      owner: "",
      token_size,
    };

    // Add to Supabase Handler
    const addMessagetoSupabase = async (
      messages: MessageT[],
      apiKey: string
    ) => {
      try {
        // Get Embeddings for the messages
        const embeddingResponse = await fetch("/api/openai/embedding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, apiKey }),
        });

        const embeddings = await embeddingResponse.json();

        // Add message to the Supabase
        const response = await fetch("/api/supabase/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages.map((m, i) => {
              return {
                ...m,
                embedding: embeddings[i].embedding,
              };
            }),
          }),
        });
        if (!response.ok) throw new Error("Failed to add message to Supabase");
        return await response.json();
      } catch (error) {
        console.log(error);
      }
    };

    // Scroll Down Handler
    const scrollDown = () => {
      const chatboxRef = get(chatboxRefAtom);
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    };

    // Start Handling
    set(handlingAtom, true);

    /* 1) Add User Message to the State */
    if (action === "generate") {
      set(messagesAtom, (prev) => {
        return [...prev, userMessage];
      });

      // Clear Input
      set(inputAtom, "");

      // Scroll down after insert
      scrollDown();
    }

    /* 2) Send Messages to the API to get response from OpenAI */
    const initialID = uuidv4();
    // Set Initial Message to the State (We need show "thinking" message to the user before we get response")
    set(messagesAtom, (prev) => {
      return [
        ...prev,
        {
          id: initialID,
          content: "",
          role: "assistant",
          created_at: String(new Date()),
          chat: chatID!!,
          token_size: 0,
        },
      ];
    });

    // Scroll down after insert
    scrollDown();

    // Check If Token Size is Exceeded
    const tokenSizeLimitExceeded = get(tokenSizeLimitAtom).isBeyondLimit;

    if (tokenSizeLimitExceeded || get(historyTypeAtom) === "global") {
      // Get User's Message
      const lastUsersMessage =
        action === "generate"
          ? userMessage
          : (get(messagesAtom).findLast(
              (message) => message.role === "user"
            ) as MessageT);

      let embedding = lastUsersMessage.embedding;

      // If we don't have embedding for the message, get it from OpenAI (When we regenerate, we already have embedding)
      if (!embedding) {
        // Get Embeddings for the User's Message
        const embeddingResponse = await fetch("/api/openai/embedding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [lastUsersMessage], apiKey }),
        });

        const embeddings = await embeddingResponse.json();
        embedding = embeddings[0].embedding;
      }

      // Get history from Supabase
      const response = await fetch("/api/supabase/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query_embedding: embedding,
          similarity_threshold: 0.79,
          match_count: 10,
          owner_id: get(ownerIDAtom),
          chat_id: get(historyTypeAtom) === "global" ? null : chatID,
        }),
      });
      const history = await response.json();

      if (history) {
        // Set the state
        set(previousContextAtom, history);
      }
    }

    // Response Fetcher and Stream Handler
    try {
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: get(openAIPayload),
        }),
        signal: get(abortControllerAtom).signal,
      });

      if (!response.ok) {
        console.log("Response not ok", response);
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        console.log("No data from response.", data);
        throw new Error("No data from response.");
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        set(messagesAtom, (prev) => {
          const responseMessage = prev.find((m) => m.id === initialID);
          if (!responseMessage) {
            console.log("No response message", responseMessage);
            return prev;
          }
          return [
            ...prev.filter((m) => m.id !== initialID),
            {
              ...responseMessage,
              content: responseMessage?.content + chunkValue,
              token_size:
                (responseMessage?.token_size ?? 0) + encode(chunkValue).length,
            },
          ];
        });

        /* Scroll to the bottom as we get chunk */
        scrollDown();
      }
    } catch (error) {
      console.log(error);
      // Set Error Message into the State If it's not aborted
      if (error !== "DOMException: The user aborted a request.") return;
      set(messagesAtom, (prev) => {
        const responseMessage = prev.find((m) => m.id === initialID);
        if (!responseMessage) {
          console.log("No response message", responseMessage);
          return prev;
        }
        return [
          ...prev.filter((m) => m.id !== initialID),
          {
            ...responseMessage,
            content: "Oops! Something went wrong. Please try again.",
          },
        ];
      });
    } finally {
      // Stop Handling
      set(handlingAtom, false);
      // Add messages to the Supabase if exists
      const finalAIMessage = get(messagesAtom).find(
        (m) => m.id === initialID
      ) as MessageT;
      if (action === "generate") {
        const instertedMessages = await addMessagetoSupabase(
          finalAIMessage ? [userMessage, finalAIMessage] : [userMessage],
          apiKey
        );

        for (const message of instertedMessages) {
          if (message.role === "user") {
            set(messagesAtom, (prev) => {
              return prev.map((m) => {
                if (m.id === userMessage.id) {
                  return {
                    ...m,
                    id: message.id,
                  };
                }
                return m;
              });
            });
          } else {
            set(messagesAtom, (prev) => {
              return prev.map((m) => {
                if (m.id === initialID) {
                  return {
                    ...m,
                    id: message.id,
                  };
                }
                return m;
              });
            });
          }
        }
      }
      // Regenerate
      else {
        const instertedMessages = await addMessagetoSupabase(
          [finalAIMessage],
          apiKey
        );
        // Change the dummy IDs with the real ones
        if (!instertedMessages) {
          console.log("No inserted messages found");
          return;
        }

        set(messagesAtom, (prev) => {
          return prev.map((m) => {
            if (m.id === initialID) {
              return {
                ...m,
                id: instertedMessages[0].id,
              };
            }
            return m;
          });
        });
      }
    }

    /* 3) Change Conversation Title */
    if (action === "generate") {
      try {
        // If chat is new, update the chat title
        const isChatNew = get(messagesAtom).length === 2;
        if (isChatNew) {
          const response = await fetch("/api/openai/chat-title", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: get(messagesAtom).map((message) => {
                return {
                  content: message.content,
                  role: message.role,
                };
              }),
              chatID: get(chatIDAtom),
              apiKey: get(openAIAPIKeyAtom),
              model: currentChat?.model ?? "gpt-3.5-turbo",
            }),
          });
          const { title } = await response.json();
          if (title) {
            set(chatsAtom, (prev) => {
              return prev.map((c) => {
                if (c.id === get(chatIDAtom)) {
                  return {
                    ...c,
                    title,
                  };
                }
                return c;
              });
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
);

// Re-generate Handler
export const regenerateHandlerAtom = atom(
  (get) => {
    // Is there any message from the assistant?
    const assistantMessage =
      get(messagesAtom).filter((m) => m.role === "assistant")?.length > 0;
    const isHandling = get(handlingAtom);
    return Boolean(assistantMessage && !isHandling);
  },
  async (get, set) => {
    // Remove last assistant message
    const allMessages = [...get(messagesAtom)];
    const lastMessage = allMessages.pop();

    if (lastMessage?.role === "assistant") {
      set(messagesAtom, allMessages);
      // Remove from Supabase
      await fetch("/api/supabase/message", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: lastMessage,
        }),
      });

      await set(addMessageAtom, "regenerate");
    }
  }
);
