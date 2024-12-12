"use client";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { Chatbot } from "@/components/chatbot/page";

function Chat() {
  const { user, loader } = useContext(AppContext); // Access user and loader from context
  const router = useRouter();

  useEffect(() => {
    // Redirect only if loader is false and user is null
    if (!loader && !user) {
      router.push("/"); // Redirect to the home page if the user is not authenticated
    }
  }, [user, loader, router]);

  // Render ChatDemo only if the user exists
  return <Chatbot />;
}

export default Chat;
