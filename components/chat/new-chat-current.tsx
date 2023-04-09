"use client";
import { currentChatAtom } from "@/atoms/chat";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAtom } from "jotai";
import { Info } from "lucide-react";
import { useCallback } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextareaDefault } from "../ui/textarea-default";

const NewChatCurrent = () => {
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const { supabase } = useSupabase();

  const saveHandler = useCallback(async () => {
    console.log("Saving");
    await supabase
      .from("chats")
      .update({
        model: currentChat?.model,
        system_prompt: currentChat?.system_prompt,
      })
      .eq("id", currentChat?.id);
  }, [
    currentChat?.id,
    currentChat?.model,
    currentChat?.system_prompt,
    supabase,
  ]);

  return (
    <div className="flex items-start justify-center flex-1 w-full h-full sm:items-center">
      {/* Container */}
      <div className="w-full max-h-full px-8 py-10 mx-8 rounded-md shadow-sm md:max-w-xl dark:bg-neutral-950/30 bg-white/50">
        <h2 className="text-lg font-medium">Start a New Chat</h2>
        <p className="mt-1 font-light dark:text-neutral-500">
          Please select your model and system propmt first. Then, you can{" "}
          <span className="font-medium dark:text-neutral-400">
            ask your first question
          </span>{" "}
          to start a new chat.
        </p>

        {/* Settings */}
        <div className="mt-6">
          <Label>Model</Label>
          <Select
            onValueChange={async (value) => {
              setCurrentChat((prev) =>
                prev ? { ...prev, model: value } : prev
              );
              await saveHandler();
            }}
            value={currentChat?.model as string}
          >
            <SelectTrigger className="w-full mt-3">
              <SelectValue placeholder="GPT-3.5 Turbo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT 4</SelectItem>
            </SelectContent>
          </Select>
          {currentChat?.model === "gpt-4" && (
            <div className="flex items-center gap-2 mt-3 dark:text-neutral-400">
              <Info size="14" />
              <div className="text-xs font-light ">
                GPT-4 is almost{" "}
                <span className="dark:text-neutral-300">10x expensive</span>{" "}
                than the previous model.
              </div>
            </div>
          )}
          <div className="mt-6">
            <Label>System Propmt</Label>
            <TextareaDefault
              value={currentChat?.system_prompt as string}
              onChange={async (e) => {
                setCurrentChat((prev) =>
                  prev
                    ? {
                        ...prev,
                        system_prompt: e.target.value,
                      }
                    : prev
                );
                await saveHandler();
              }}
              className="mt-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatCurrent;
