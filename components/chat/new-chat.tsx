"use client";
import { openAISettingsAtom } from "@/atoms/chat";
import { useAtom } from "jotai";
import { focusAtom } from "jotai-optics";
import { Info } from "lucide-react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextareaDefault } from "../ui/textarea-default";
const focusedModelAtom = focusAtom(openAISettingsAtom, (optic) =>
  optic.prop("model")
);
const focusedSystemPropmtAtom = focusAtom(openAISettingsAtom, (optic) =>
  optic.prop("system_prompt")
);

const focusedHistoryTypeAtom = focusAtom(openAISettingsAtom, (optic) =>
  optic.prop("history_type")
);

const NewChat = () => {
  const [model, setModel] = useAtom(focusedModelAtom);
  const [systemPropmt, setSystemPropmt] = useAtom(focusedSystemPropmtAtom);
  const [historyType, setHistoryType] = useAtom(focusedHistoryTypeAtom);

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
            onValueChange={(value: "gpt-3.5-turbo" | "gpt-4") =>
              setModel(value)
            }
          >
            <SelectTrigger className="w-full mt-3">
              <SelectValue placeholder="GPT-3.5 Turbo" defaultValue={model} />
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
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
      </div>
    </div>
  );
};

export default NewChat;
