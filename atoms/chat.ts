import { MessageI } from "@/types/collections";
import { atom } from "jotai";
import { createRef } from "react";
import { uuid } from "uuidv4";

export const inputAtom = atom<string>("");
export const chatboxRefAtom = atom(createRef<HTMLDivElement>());
export const chatAtom = atom<MessageI[]>([
  {
    id: "1",
    content: "Hello, how can I help you today?",
    role: "assistant",
    createdAt: new Date(),
  },
]);
export const systemPropmtAtom = atom<string>(
  `You are makrGPT, a large language model trained by OpenAI. Answer as concisely as possible and ALWAYS answer in MARKDOWN. Current date: ${new Date().toLocaleDateString()}`
);
const historyAtom = atom([]);
const handlingAtom = atom<boolean>(false);
const abortControllerAtom = atom<AbortController>(new AbortController());
export const abortControllerHandlerAtom = atom(
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
    if (action === "generate") {
      /* 1) Add User Message */
      const inputValue = get(inputAtom);
      const isHandlig = get(handlingAtom);
      if (inputValue.length < 2 || isHandlig) return;
      set(chatAtom, (prev) => {
        return [
          ...prev,
          {
            id: uuid(),
            content: get(inputAtom),
            role: "user",
            createdAt: new Date(),
          },
        ];
      });
      set(inputAtom, "");
      set(handlingAtom, true);
    }

    /* 2) Send to the API */
    const response = await fetch("/api/chat", {
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
    const initialID = uuid();
    set(chatAtom, (prev) => {
      return [
        ...prev,
        {
          id: initialID,
          content: "",
          role: "assistant",
          createdAt: new Date(),
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

    set(handlingAtom, false);
  }
);

export const regenerateResponseAtom = atom(
  (get) => {
    // Is there any message from the assistant?
    const assistantMessage =
      get(chatAtom).filter((m) => m.role === "assistant")?.length > 1;
    const isHandling = get(handlingAtom);
    return Boolean(assistantMessage && !isHandling);
  },
  async (get, set) => {
    // Remove last assistant message
    const allMessages = [...get(chatAtom)];
    allMessages.pop();
    set(chatAtom, allMessages);
    await set(addMessageAtom, "regenerate");
  }
);
