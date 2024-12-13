"use client";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "@/app/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userCredits, setUserCredits] = useState();
  const [loader, setLoader] = useState(true); // Initially true until Firebase checks

  const assistantId = "dataknobs"; // Fixed assistantId for this chatbot
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null); // Track the session ID for the user
  const [existingSessions, setExistingSessions] = useState([]); // Store existing sessions for dropdown

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setLoader(true);
        setUser(currentUser);
        console.log(currentUser.photoURL);
        const querySnapshotNew = await getDocs(
          query(
            collection(db, "userdata"),
            where("email", "==", currentUser.email)
          )
        );

        if (!querySnapshotNew.empty) {
          const userData = querySnapshotNew.docs[0].data();
          setUserCredits(userData.credits);
        }
        setLoader(false);
      } else {
        setUser(null);
        setLoader(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const reduceCredits = async (n) => {
    const querySnapshotNew = await getDocs(
      query(collection(db, "userdata"), where("email", "==", user.email))
    );
    const documentRef = doc(db, "userdata", querySnapshotNew.docs[0].id);
    updateDoc(documentRef, {
      credits: userCredits - n,
    });
    setUserCredits((prev) => prev - n);
  };

  // Set sessionId to a unique UUID instead of +1 logic
  useEffect(() => {
    const fetchAllSessions = async () => {
      // Generate a unique sessionId using uuid
      const uniqueSessionId = uuidv4();
      console.log(uniqueSessionId);
      setSessionId(uniqueSessionId);
      const response = await fetch(
        `http://localhost:5000/api/chat?assistantId=${assistantId}&userEmail=${user.email}`
      );
      if (response.ok) {
        const allSessions = await response.json();
        console.log("Fetched all sessions:", allSessions); // Log the fetched sessions for debugging
        setExistingSessions(allSessions); // Set all sessions for dropdown
      }
    };

    if (user?.email) {
      fetchAllSessions(); // Fetch all sessions when the component mounts
    }
  }, [user?.email]); // Run this effect when the user's email is available

  // Handler to update input state
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  // Handler to submit a message and add it to the chat
  const handleSubmit = async (event, options = {}) => {
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
      setTimeout(async () => {
        const assistantMessage = {
          role: "assistant",
          content: `Hi, I'm currently not active, please try again after some time.`,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        setIsLoading(false);

        // Ensure you're passing the correct sessionId to the backend
        await saveChatToAPI(sessionId, [
          ...messages,
          userMessage,
          assistantMessage,
        ]);
      }, 2000);

      // Clear input after submission
      setInput("");
    }
  };

  // Save chat to the API
  const saveChatToAPI = async (sessionId, newMessages) => {
    console.log("saving : " + sessionId);
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistantId,
          userEmail: user.email,
          sessionId, // Make sure you're passing the correct sessionId here
          messages: newMessages.slice(-2), // Save only the last two messages to the API
        }),
      });

      if (!response.ok) {
        console.error("Failed to save chat");
      }
    } catch (error) {
      console.error("Error saving chat to API:", error);
    }
  };

  // Handle sessionchange
  const handleSessionChange = async (sessionvalue) => {
    await loadSessionMessages(sessionvalue);
  };

  // Load messages when a session is selected
  const loadSessionMessages = async (selectedSessionId) => {
    try {
      const selectedSession = existingSessions.find(
        (session) => session.sessionId === selectedSessionId
      );

      if (selectedSession) {
        setMessages(selectedSession.messages); // Load the selected session's messages
        setSessionId(selectedSession.sessionId);
      } else {
        console.log("Session not found in existingSessions");
      }
    } catch (error) {
      console.error("Error loading session messages:", error);
    }
  };

  // Function to handle appending messages (if needed)
  const append = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Function to stop generating response (if needed)
  const stop = () => {
    setIsLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userCredits,
        loader,
        reduceCredits,
        assistantId,
        messages,
        input,
        isLoading,
        sessionId,
        existingSessions,
        handleInputChange,
        handleSubmit,
        handleSessionChange,
        append,
        stop,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
