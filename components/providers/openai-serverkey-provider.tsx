import React from "react";
import OpenAIKeyProvider from "./openai-key-provider";

const OpenAIServerKeyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <OpenAIKeyProvider serverKey={process.env.OPENAI_API_KEY ?? ""}>
        {children}
      </OpenAIKeyProvider>
    </>
  );
};

export default OpenAIServerKeyProvider;
