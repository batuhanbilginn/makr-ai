"use client";
import { currentChatAtom, defaultSystemPropmt } from "@/atoms/chat";
import useChats from "@/hooks/useChats";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAtomValue } from "jotai";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const currentChat = useAtomValue(currentChatAtom);
  const { mutate } = useChats();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [systemPropmt, setSystemPropmt] = useState(defaultSystemPropmt);

  // Set the Current Chat's Settings
  useEffect(() => {
    if (currentChat) {
      setModel(currentChat.model!!);
      setSystemPropmt(currentChat.system_prompt!!);
    }
  }, [currentChat]);

  const saveHandler = async () => {
    await supabase
      .from("chats")
      .update({
        model,
        system_prompt: systemPropmt,
      })
      .eq("id", currentChat?.id);

    await mutate();
    triggerRef.current?.click();
  };
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
        <DialogContent className="">
          <DialogHeader>
            <h2>Change settings</h2>
          </DialogHeader>
          {/* Settings */}
          <div className="mt-6">
            <Label>Model</Label>
            <Select
              onValueChange={(value) =>
                setModel(value as "gpt-3.5-turbo" | "gpt-4")
              }
              value={model}
            >
              <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Select a model." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT 4</SelectItem>
              </SelectContent>
            </Select>
            {model === "gpt-4" && (
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
                value={systemPropmt}
                onChange={(e) => {
                  setSystemPropmt(e.target.value);
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
