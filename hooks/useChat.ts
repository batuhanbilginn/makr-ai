import { inputAtom, systemPropmtAtom } from "@/atoms/chat";
import { MessageT } from "@/types/collections";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useChat = ({
  chatID,
  initialMessages,
}: {
  chatID: string;
  initialMessages: MessageT[];
}) => {
  console.log("useChat Renders");
  const systemPropmt = useAtomValue(systemPropmtAtom);
  const [inputValue, setInputValue] = useAtom(inputAtom);
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageT[]>(initialMessages);
  const chatboxRef = useRef<HTMLDivElement>(null);
  let abortController = new AbortController();

  const addMessagetoSupabase = useCallback(
    async (message: Omit<MessageT, "id" | "created_at">) => {
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
    },
    [chatID]
  );

  const addMessageHandler = async (action: "generate" | "regenerate") => {
    // Early Returns
    if (isHandling || (inputValue.length < 2 && action !== "regenerate"))
      return;

    // Build Message Object in Function Scope - We need to use it in multiple places
    const message = {
      content: inputValue,
      role: "user",
      chat: chatID,
    };

    // Start Handling
    setIsHandling(true);

    /* 1) Add User Message - Only For New Generation */
    if (action === "generate") {
      // Add message to the state
      setMessages((prev) => [
        ...prev,
        { ...message, id: uuidv4(), created_at: String(new Date()) },
      ]);

      console.log("Messages from addMessageHandler");
      console.log({ messages });

      // Clear Input
      setInputValue("");
    }

    /* 2) Get Response from OpenAI */
    try {
      console.log({ messages });
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { content: systemPropmt, role: "system" },
            ...messages.map((m) => ({
              content: m.content,
              role: m.role,
            })),
          ],
        }),
        signal: abortController.signal,
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
      setMessages((prev) => {
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
        setMessages((prev) => {
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

        /* Scroll to the bottom as we get chunk */
        if (chatboxRef.current) {
          chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
      }

      // Stop Handling
      setIsHandling(false);

      // Add message to the Supabase
      const finalAIMessage = messages.find((m) => m.id === initialID);
      if (finalAIMessage) {
        Promise.all([
          action === "generate" ? addMessagetoSupabase(message) : null,
          addMessagetoSupabase({
            role: finalAIMessage?.role,
            content: finalAIMessage?.content,
            chat: finalAIMessage?.chat,
          }),
        ]);
      } else {
        await addMessagetoSupabase(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const regenerateHandler = async () => {
    // Remove last assistant message
    const allMessages = [...messages];
    allMessages.pop();
    setMessages(allMessages);
    await addMessageHandler("regenerate");
  };

  const cancelHandler = () => {
    abortController.abort();
    setIsHandling(false);
    abortController = new AbortController();
  };

  return {
    inputValue,
    setInputValue,
    isHandling,
    messages,
    chatboxRef,
    addMessageHandler,
    regenerateHandler,
    cancelHandler,
  };
};

export default useChat;
