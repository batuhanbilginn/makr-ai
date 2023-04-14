"use client";
import {
  currentChatAtom,
  defaultSystemPropmt,
  historyTypeAtom,
  tokenCountAtom,
} from "@/atoms/chat";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAtom, useAtomValue } from "jotai";
import debounce from "lodash.debounce";
import { Info } from "lucide-react";

import { titleCase } from "@/utils/helpers";
import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextareaDefault } from "../ui/textarea-default";

const ChatSettingsMenu = () => {
  const { supabase } = useSupabase();
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const tokenCounts = useAtomValue(tokenCountAtom);
  const [historyType, setHistoryType] = useAtom(historyTypeAtom);

  // Send system prompt to supabase
  const sendSupabase = useCallback(
    async (value: string, id: string) => {
      await supabase
        .from("chats")
        .update({
          system_prompt: value,
        })
        .eq("id", id);
    },
    [supabase]
  );

  // Reset System Input to default
  const resetSystemInput = useCallback(async () => {
    setCurrentChat((prev) =>
      prev
        ? {
            ...prev,
            system_prompt: defaultSystemPropmt,
          }
        : prev
    );
    await sendSupabase(defaultSystemPropmt, currentChat?.id as string);
  }, [currentChat?.id, sendSupabase, setCurrentChat]);

  // Debounce the supabase call
  const debouncedSendSupabase = useMemo(
    () => debounce(sendSupabase, 1000),
    [sendSupabase]
  );

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center max-w-full gap-4 pt-2 pb-4 overflow-x-auto text-xs whitespace-nowrap">
          <div className="px-2 py-1 bg-white rounded-md dark:bg-neutral-900">
            <span className=" text-neutral-400">Model: </span>
            {currentChat?.model === "gpt-3.5-turbo" ? "GPT-3.5 Turbo" : "GPT-4"}
          </div>
          <div className="px-2 py-1 bg-white rounded-md shadow-sm dark:bg-neutral-900">
            <span className=" text-neutral-400">System Propmt: </span>
            {currentChat?.system_prompt === defaultSystemPropmt
              ? "Default"
              : "Custom"}
          </div>
          <div className="px-2 py-1 bg-white rounded-md shadow-sm dark:bg-neutral-900">
            <span className=" text-neutral-400">Token Size: </span>
            {tokenCounts.currentChatToken}
          </div>
          <div className="px-2 py-1 bg-white rounded-md shadow-sm dark:bg-neutral-900">
            <span className=" text-neutral-400">History Type: </span>
            {titleCase(historyType)}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2>Change settings</h2>
          </DialogHeader>
          {/* Settings */}
          <div className="mt-6">
            <Label>Model</Label>
            <Select
              onValueChange={async (value: "gpt-4" | "gpt-3.5-turbo") => {
                setCurrentChat((prev) =>
                  prev ? { ...prev, model: value } : prev
                );
                await supabase
                  .from("chats")
                  .update({
                    model: value,
                  })
                  .eq("id", currentChat?.id);
              }}
              value={currentChat?.model as string}
            >
              <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Select a model." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"gpt-3.5-turbo"}>GPT-3.5 Turbo</SelectItem>
                <SelectItem value={"gpt-4"}>GPT 4</SelectItem>
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
              <Label>History Type</Label>
              <Select
                onValueChange={(value: "global" | "chat") => {
                  setHistoryType(value);
                }}
                value={historyType}
              >
                <SelectTrigger className="w-full mt-3">
                  <SelectValue placeholder="Select a model." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"global"}>Global</SelectItem>
                  <SelectItem value={"chat"}>Chat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between w-full">
                <Label>System Propmt</Label>
                <button
                  onClick={resetSystemInput}
                  className="text-xs text-neutral-600"
                >
                  Reset to Default
                </button>
              </div>
              <TextareaDefault
                value={currentChat?.system_prompt as string}
                onChange={async (e) => {
                  const value = e.target.value;
                  setCurrentChat((prev) =>
                    prev
                      ? {
                          ...prev,
                          system_prompt: value,
                        }
                      : prev
                  );
                  await debouncedSendSupabase(
                    value ? value : defaultSystemPropmt,
                    currentChat?.id as string
                  );
                }}
                className="mt-3"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSettingsMenu;
