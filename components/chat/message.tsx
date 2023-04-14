import { MessageT } from "@/types/collections";

import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import "highlight.js/styles/github-dark-dimmed.css";
import { Clipboard } from "lucide-react";
import { useRef } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Message = ({ message }: { message: MessageT }) => {
  const isAssistant = message.role === "assistant";
  const codeRef = useRef<HTMLElement>(null);
  const { user } = useAuth();
  return (
    <div
      className={
        !isAssistant
          ? "dark:bg-neutral-950/60 bg-neutral-100/50"
          : "dark:bg-neutral-900 bg-neutral-200/40 last:pb-64 last:sm:pb-44"
      }
    >
      {/* Container */}
      <div className="flex w-full max-w-3xl gap-4 px-4 py-10 mx-auto sm:px-8">
        {/* Avatar */}
        <Avatar className="w-8 h-8 ring-2 ring-offset-2 dark:ring-neutral-700 ring-neutral-400">
          <AvatarImage
            src={
              !isAssistant
                ? user?.avatar_url ?? "/user-avatar.png"
                : "/makr.-avatar.png"
            }
          />
          <AvatarFallback>{!isAssistant ? "YOU" : "AI"}</AvatarFallback>
        </Avatar>
        {/* Message */}
        <div className="w-[calc(100%-50px)]">
          {!isAssistant || message.content !== "" ? (
            <ReactMarkdown
              className="break-words markdown"
              components={{
                code: ({ children, inline, className }) => {
                  const language = className?.split("-")[1];
                  if (inline)
                    return (
                      <span className="px-2 py-1 text-sm rounded-md dark:bg-neutral-800 bg-neutral-50">
                        {children}
                      </span>
                    );
                  return (
                    <div className="w-full my-5 overflow-hidden rounded-md">
                      {/* Code Title */}
                      <div className="dark:bg-[#0d111780] bg-neutral-50 py-2 px-3 text-xs flex items-center justify-between">
                        <div>{language ?? "javascript"}</div>
                        {/* Copy code to the clipboard */}
                        <CopyToClipboard
                          text={codeRef?.current?.innerText as string}
                        >
                          <button className="flex items-center gap-1">
                            <Clipboard size="14" />
                            Copy Code
                          </button>
                        </CopyToClipboard>
                      </div>
                      {/* Code Block */}
                      <code
                        ref={codeRef}
                        className={
                          (className ?? "hljs language-javascript") +
                          " !whitespace-pre"
                        }
                      >
                        {children}
                      </code>
                    </div>
                  );
                },
              }}
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
            >
              {message.content ?? ""}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 text-sm rounded-md max-w-fit dark:bg-neutral-950/50 bg-neutral-200">
              <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse" />
              <span>Thinking</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
