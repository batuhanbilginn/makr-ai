"use client";

import {
  addMessageAtom,
  cancelHandlerAtom,
  inputAtom,
  regenerateHandlerAtom,
} from "@/atoms/chat";
import useChats from "@/hooks/useChats";
import { useAtom, useSetAtom } from "jotai";
import { RefreshCw, Send, StopCircle } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatSettingsMenu from "./chat-settings-menu";

const ChatInput = ({
  isExistingChat,
  chatID,
}: {
  isExistingChat: boolean;
  chatID?: string;
}) => {
  const { addChatHandler } = useChats();
  const [inputValue, setInputValue] = useAtom(inputAtom);
  const [isHandling, addMessageHandler] = useAtom(addMessageAtom);
  const [isRegenerateSeen, regenerateHandler] = useAtom(regenerateHandlerAtom);
  const cancelHandler = useSetAtom(cancelHandlerAtom);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isExistingChat && !chatID) {
      await addChatHandler();
    } else {
      await addMessageHandler("generate");
    }
  };

  // Enter Key Handler
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isExistingChat && !chatID) {
          await addChatHandler();
        } else {
          await addMessageHandler("generate");
        }
      }
    },
    [isExistingChat, chatID, addMessageHandler, addChatHandler]
  );

  // Subsribe to Key Down Event
  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="sticky bottom-0 left-0 right-0 px-8 py-10 bg-gradient-to-b from-transparent dark:via-neutral-950/60 dark:to-neutral-950/90 via-neutral-50/60 to-neutral-50/90">
      {/* Container */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Abort Controller */}
        {isHandling && (
          <div className="flex items-center justify-center w-full max-w-5xl py-4">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={cancelHandler}
            >
              <span>Stop Generating</span> <StopCircle size="14" />
            </Button>
          </div>
        )}
        {/* Regenerate Controller */}
        {!isHandling && isRegenerateSeen && (
          <div className="flex items-center justify-center py-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={regenerateHandler}
            >
              <span>Regenerate Response</span> <RefreshCw size="14" />
            </Button>
          </div>
        )}
        {/* Settings */}
        {isExistingChat && <ChatSettingsMenu />}
        {/* Input Container */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end w-full py-2 bg-white rounded-md shadow-sm focus-within:outline focus-within:outline-neutral-300 dark:focus-within:outline-neutral-500 focus-within:outline-1 dark:bg-neutral-900"
        >
          <Textarea
            className="h-auto peer"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button type="submit">
            <Send
              size="18"
              className="mb-2 mr-4 text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
