"use client";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import LoginPage from "./(pages)/(auth)/login/page";

export default function Home() {
  const { user, loader } = useContext(AppContext); // Access user and loader from context
  const router = useRouter();

  useEffect(() => {
    if (!loader && user) {
      router.push("/chat"); // Redirect to the chat page if the user is authenticated
    }
  }, [user, loader, router]);

  return (
    <>
      <LoginPage />
    </>
  );
}
