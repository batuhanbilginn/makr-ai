import { MessageT } from "@/types/collections";
import { atom } from "jotai";
import { createRef } from "react";
import { v4 as uuidv4 } from "uuid";

export const systemPropmtAtom = atom<string>(
  `You are makrGPT, a large language model trained by OpenAI. Answer as concisely as possible and ALWAYS answer in MARKDOWN. Current date: ${new Date().toLocaleDateString()}`
);
export const inputAtom = atom<string>("");
export const chatboxRefAtom = atom(createRef<HTMLDivElement>());
const handlingAtom = atom<boolean>(false);
const abortControllerAtom = atom<AbortController>(new AbortController());
export const chatIDAtom = atom<string>("");
export const chatAtom = atom<MessageT[]>([]);
export const cancelHandlerAtom = atom(
  (get) => get(handlingAtom),
  (get, set) => {
    const abortController = get(abortControllerAtom);
    abortController.abort();
    set(handlingAtom, false);
    set(abortControllerAtom, new AbortController());
  }
);

export const addMessageAtom = atom(
  (get) => get(handlingAtom),
  async (get, set, action: "generate" | "regenerate" = "generate") => {
    const inputValue = get(inputAtom);
    const isHandlig = get(handlingAtom);
    const chatID = get(chatIDAtom);
    // Early Returns
    if (isHandlig || (inputValue.length < 2 && action !== "regenerate")) return;

    // Build User's Message Object in Function Scope - We need to use it in multiple places
    const userMessage = {
      content: inputValue,
      role: "user",
      chat: chatID,
    };

    // Add to Supabase Handler
    const addMessagetoSupabase = async (
      message: Omit<MessageT, "id" | "created_at">
    ) => {
      try {
        // Add message to the Supabase
        await fetch("/api/supabase/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: { ...message, chat: chatID },
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };

    // Start Handling
    set(handlingAtom, true);

    if (action === "generate") {
      /* 1) Add User Message to the State */
      set(chatAtom, (prev) => {
        return [
          ...prev,
          {
            ...userMessage,
            id: uuidv4(),
            created_at: String(new Date()),
          },
        ];
      });

      // Clear Input
      set(inputAtom, "");
    }

    /* 2) Send to the API */
    const response = await fetch("/api/openai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { content: get(systemPropmtAtom), role: "system" },
          ...get(chatAtom).map((m) => ({
            content: m.content,
            role: m.role,
          })),
        ],
      }),
      signal: get(abortControllerAtom).signal,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      console.log("No data", response);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // Set initial message
    const initialID = uuidv4();
    set(chatAtom, (prev) => {
      return [
        ...prev,
        {
          id: initialID,
          content: "",
          role: "assistant",
          created_at: String(new Date()),
          chat: chatID,
        },
      ];
    });

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      set(chatAtom, (prev) => {
        const responseMessage = prev.find((m) => m.id === initialID);
        if (!responseMessage) throw new Error("No response message found");
        return [
          ...prev.filter((m) => m.id !== initialID),
          {
            ...responseMessage,
            content: responseMessage?.content + chunkValue,
          },
        ];
      });

      const chatboxRef = get(chatboxRefAtom);

      /* Scroll to the bottom as we get chunk */
      if (chatboxRef.current) {
        chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
      }
    }

    // Stop Handling
    set(handlingAtom, false);
    // Add message to the Supabase
    const finalAIMessage = get(chatAtom).find((m) => m.id === initialID);
    if (finalAIMessage) {
      await Promise.all([
        action === "generate" ? addMessagetoSupabase(userMessage) : null,
        addMessagetoSupabase({
          role: finalAIMessage?.role,
          content: finalAIMessage?.content,
          chat: finalAIMessage?.chat,
        }),
      ]);
    } else {
      await addMessagetoSupabase(userMessage);
    }
  }
);

export const regenerateHandlerAtom = atom(
  (get) => {
    // Is there any message from the assistant?
    const assistantMessage =
      get(chatAtom).filter((m) => m.role === "assistant")?.length > 0;
    const isHandling = get(handlingAtom);
    return Boolean(assistantMessage && !isHandling);
  },
  async (get, set) => {
    // Remove last assistant message
    const allMessages = [...get(chatAtom)];
    const lastMessage = allMessages.pop();
    if (lastMessage?.role === "assistant") {
      set(chatAtom, allMessages);
      // Remove from Supabase
      const deleteFromSupabase = fetch("/api/supabase/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lastMessage.id,
        }),
      });

      const regenerateResponse = set(addMessageAtom, "regenerate");

      await Promise.all([deleteFromSupabase, regenerateResponse]);
    }
  }
);
