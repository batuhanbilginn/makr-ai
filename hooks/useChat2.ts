import { chatAtom, chatIDAtom } from "@/atoms/chat";
import { MessageT } from "@/types/collections";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

const useChat2 = ({
  chatID,
  initialMessages,
}: {
  chatID: string;
  initialMessages: MessageT[];
}) => {
  const setChatID = useSetAtom(chatIDAtom);
  const setMessages = useSetAtom(chatAtom);
  useEffect(() => {
    setChatID(chatID);
    setMessages(initialMessages ?? []);
  }, []);

  console.log("useChat2 Renders");
};

export default useChat2;
