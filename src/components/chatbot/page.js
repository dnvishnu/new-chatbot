"use client";
import { Chat } from "@/components/ui/chat";
import { AppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export function Chatbot() {
  const SIDEBAR_WIDTH = "16rem";
  const {
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    handleSessionChange,
    existingSessions,
  } = useContext(AppContext);

  const searchParam = useSearchParams();
  const session = searchParam.get("session");

  useEffect(() => {
    if (session) {
      handleSessionChange(session);
    }
  }, [session, existingSessions]);

  return (
    <div
      className={`flex w-full lg:w-[calc(100vw-${SIDEBAR_WIDTH})]`}
      style={{
        height: "90vh",
      }}
    >
      <div className="w-full">
        <Chat
          className={`grow w-full ${
            messages.length > 0 ? "h-full" : "max-h-full"
          }`}
          messages={messages}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[]}
          style={{
            padding: "100px",
          }}
        />
      </div>
    </div>
  );
}
