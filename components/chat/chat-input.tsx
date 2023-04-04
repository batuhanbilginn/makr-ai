"use client";

import {
  abortControllerHandlerAtom,
  addMessageAtom,
  inputAtom,
  regenerateResponseAtom,
} from "@/atoms/chat";
import { useAtom, useSetAtom } from "jotai";
import { RefreshCw, Send, StopCircle } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const ChatInput = () => {
  const [value, setValue] = useAtom(inputAtom);
  const [isHandling, submitHandler] = useAtom(addMessageAtom);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler();
  };
  const handlerAbort = useSetAtom(abortControllerHandlerAtom);
  const [isRegenerateSeen, regenerateHandler] = useAtom(regenerateResponseAtom);

  // Enter Key Handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitHandler();
      }
    },
    [submitHandler]
  );

  // Subsribe to Key Down Event
  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="absolute bottom-0 left-0 right-0 px-8 py-10 bg-gradient-to-b from-transparent via-neutral-950/70 to-neutral-950/90">
      {/* Abort Controller */}
      {isHandling && !isRegenerateSeen && (
        <div className="flex items-center justify-center w-full max-w-5xl py-4 mx-auto">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={handlerAbort}
          >
            <span>Stop Generating</span> <StopCircle size="16" />
          </Button>
        </div>
      )}
      {/* Regenerate Controller */}
      {!isHandling && isRegenerateSeen && (
        <div className="flex items-center justify-center w-full max-w-5xl py-4 mx-auto">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={regenerateHandler}
          >
            <span>Regenerate Response</span> <RefreshCw size="16" />
          </Button>
        </div>
      )}
      {/* Input Container */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end w-full max-w-5xl py-2 mx-auto rounded-md shadow-md focus-within:outline focus-within:outline-neutral-300 dark:focus-within:outline-neutral-500 focus-within:outline-1 dark:bg-neutral-900 bg-neutral-100"
      >
        <Textarea
          className="h-auto peer"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
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
  );
};

export default ChatInput;
