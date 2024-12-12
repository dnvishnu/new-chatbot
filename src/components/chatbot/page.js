"use client";
import { Chat } from "@/components/ui/chat";
import { useEffect, useState } from "react";

export function Chatbot() {
  const SIDEBAR_WIDTH = "16rem";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handler to update input state
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Handler to submit a message and add it to the chat
  const handleSubmit = (event, options = {}) => {
    event.preventDefault();

    const { experimental_attachments } = options;

    if (input.trim() !== "" || experimental_attachments) {
      // Add user message to chat
      const userMessage = {
        role: "user",
        content: input.trim() !== "" ? input : "(Attachment sent)",
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);

      if (experimental_attachments) {
        // Convert FileList to an array
        const attachmentsArray = Array.from(experimental_attachments);

        console.log(attachmentsArray);

        // Extract file names
        const fileNames = attachmentsArray.map((file) => file.name).join(", ");

        const fileMessage = {
          role: "assistant",
          content: `Received the following file(s): ${fileNames}`,
        };

        setMessages((prevMessages) => [...prevMessages, fileMessage]);
      }

      setIsLoading(true);

      // Simulate an AI response (you can replace this with actual logic)
      setTimeout(() => {
        const assistantMessage = {
          role: "assistant",
          content: `Hi, I'm currently not active, pleae try again after sometime`,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setIsLoading(false);
      }, 2000);

      // Clear input and reset files after submission
      setInput("");
    }
  };

  // Function to handle appending messages (if needed)
  const append = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Function to stop generating response (if needed)
  const stop = () => {
    setIsLoading(false);
    // Implement any additional logic to stop response generation
  };

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div
      className={`flex w-full lg:w-[calc(100vw-${SIDEBAR_WIDTH})]`}
      style={{
        height: "90vh"
      }}
    >
      <Chat
        className="grow w-full" // Ensures Chat takes up full width of parent
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
  );
}
