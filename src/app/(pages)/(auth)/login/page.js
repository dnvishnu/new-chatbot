"use client";
import Image from "next/image";
import Link from "next/link";
import { UserAuthForm } from "./userAuthForm";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase"; // Adjust path to your firebase.js
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [value, setValue] = useState({ email: "", password: "" });
  const [errormsg, setErrormsg] = useState("");

  const handleSuccess = () => {
    router.push("chat");
  };

  const handleSubmission = () => {
    if (!value.email || !value.password) {
      setErrormsg("Fill in all fields");
    } else {
      signInWithEmailAndPassword(auth, value.email, value.password)
        .then((res) => {
          setValue({ email: "", password: "" });
          handleSuccess();
        })
        .catch((error) => {
          setErrormsg(error.code);
          if (error.code === "auth/wrong-password") {
            setErrormsg("Invalid credentials");
          }
        });
    }
  };

  // Google Sign-In
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // After successful login, redirect to chatbot page
        handleSuccess();
      })
      .catch((error) => {
        console.log("Error during Google Sign-In:", error.message);
      });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side: Title and Info */}
      <div className="relative flex flex-col justify-between bg-zinc-900 p-10 text-white">
        <div>
          <div className="flex items-center mb-6 text-lg font-medium">
            <Image
              src="https://storage.googleapis.com/kreatewebsites-assets/images/dataknobs-logo.webp"
              alt="KreateBots Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            KreateBots
          </div>
          <h1 className="font-bold" style={{ fontSize: "3rem" }}>
            Welcome to KreateBots
          </h1>
          <p className="mt-4 text-gray-300">
            At KreateBots, we specialize in designing cutting-edge AI-driven
            chatbot solutions that empower businesses to achieve seamless
            customer engagement and unparalleled efficiency.
          </p>
          <p className="mt-4 text-gray-400">
            Join hundreds of businesses transforming their operations with
            KreateBots.
          </p>
        </div>

        <div className="mt-8">
          <blockquote className="space-y-4">
            <p className="text-lg">
              &ldquo;KreateBots has revolutionized how we interact with
              customers, providing fast and personalized experiences with
              ease.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex flex-col items-center justify-center p-10 lg:p-20">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Sign In to Your Account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials below to access your account and explore
              the power of AI-driven chatbots.
            </p>
          </div>

          <div className="mt-6">
            <UserAuthForm
              {...{ signInWithGoogle, handleSubmission, value, setValue }}
            />
          </div>

          {errormsg && (
            <p className="mt-4 text-sm text-center text-red-500">{errormsg}</p>
          )}

          <p className="mt-4 text-center text-sm text-gray-500">
            By signing in, you agree to our
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary mx-1"
            >
              Terms of Service
            </Link>
            and
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary mx-1"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
