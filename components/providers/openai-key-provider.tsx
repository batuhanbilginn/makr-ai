"use client";

import { openAIAPIKeyAtom, openAPIKeyHandlerAtom } from "@/atoms/chat";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { Key } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const OpenAIKeyProvider = ({
  children,
  serverKey,
}: {
  children: React.ReactNode;
  serverKey?: string;
}) => {
  useHydrateAtoms([[openAIAPIKeyAtom, serverKey] as const]);
  const [openAIKey, keyHandler] = useAtom(openAPIKeyHandlerAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHandling, setIsHandling] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { user } = useAuth();

  // Save Handler
  const saveHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = inputRef.current?.value;
    if (value && value.length > 0) {
      setIsHandling(true);
      // Check if the key is valid
      const response = await fetch("/api/openai/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: value }),
      });
      const data = await response.json();
      if (response!.ok) {
        keyHandler({ action: "set", key: value });
      } else {
        console.log(data.message); // TODO: Add Toast
      }
      setIsHandling(false);
    }
  };

  // Set the OpenAI Key on First Render
  useEffect(() => {
    if (!openAIKey) {
      keyHandler({ action: "get" });
      setIsChecked(true);
    }
  }, [openAIKey, keyHandler]);

  return (
    <>
      {!openAIKey && isChecked && user && (
        <div
          id="openai"
          className="fixed inset-0 dark:bg-neutral-950/40 backdrop-blur-md z-[99999] flex items-center justify-center"
        >
          <div className="w-full max-w-lg px-8 py-8 bg-white rounded-md shadow-lg dark:bg-neutral-950">
            <div className="flex items-center justify-center w-10 h-10 rounded-md dark:bg-neutral-800 bg-neutral-100">
              <Key />
            </div>
            <h2 className="mt-2 text-lg">Set Your OpenAI API Key</h2>
            <p className="mt-1 text-xs dark:text-neutral-500 text-neutral-500">
              We do{" "}
              <span className="font-medium dark:text-neutral-300 text-neutral-800">
                not store your OpenAI API keys on our servers
              </span>
              . Instead,{" "}
              <span className="font-medium dark:text-neutral-300 text-neutral-800">
                we store them in your local storage,
              </span>
              which means that{" "}
              <span className="font-medium dark:text-neutral-300 text-neutral-800">
                only you have access to your API keys.
              </span>{" "}
              You can be confident that your key is safe and secure as long as
              you do not share your device with others.
            </p>
            {/* Form Container */}
            <form className="mt-6" onSubmit={saveHandler}>
              <Label>OpenAI API Key</Label>
              <Input
                ref={inputRef}
                className="mt-2"
                type="password"
                placeholder="sk-....eScl"
              />
              <Button
                className="w-full mt-6"
                disabled={isHandling}
                type="submit"
              >
                {isHandling ? "Saving..." : "Save Locally"}
              </Button>
            </form>
          </div>
        </div>
      )}
      {openAIKey && children}
    </>
  );
};

export default OpenAIKeyProvider;
