"use client";
import { currentChatAtom, defaultSystemPropmt } from "@/atoms/chat";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAtom } from "jotai";
import { Info } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "../ui/button";
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

  const triggerRef = useRef<HTMLButtonElement>(null);
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);

  const saveHandler = useCallback(async () => {
    await supabase
      .from("chats")
      .update({
        model: currentChat?.model,
        system_prompt: currentChat?.system_prompt,
      })
      .eq("id", currentChat?.id);

    triggerRef.current?.click();
  }, [currentChat, supabase]);
  return (
    <div>
      <Dialog>
        <DialogTrigger
          ref={triggerRef}
          className="flex items-center gap-4 pt-2 pb-4 text-xs"
        >
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
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2>Change settings</h2>
          </DialogHeader>
          {/* Settings */}
          <div className="mt-6">
            <Label>Model</Label>
            <Select
              onValueChange={(value) =>
                setCurrentChat((prev) =>
                  prev ? { ...prev, model: value } : prev
                )
              }
              value={currentChat?.model as string}
            >
              <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Select a model." />
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
                onChange={(e) => {
                  setCurrentChat((prev) =>
                    prev
                      ? {
                          ...prev,
                          system_prompt: e.target.value,
                        }
                      : prev
                  );
                }}
                className="mt-3"
              />
            </div>
          </div>
          <Button onClick={saveHandler}>Save Settings</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSettingsMenu;
