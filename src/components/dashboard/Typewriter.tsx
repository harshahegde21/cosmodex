"use client";

import { useState, useEffect } from "react";

export function Typewriter({ messages }: { messages: string[] }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(50);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const i = loopNum % messages.length;
    const fullText = messages[i];
    // Avoid calling setState synchronously inside the effect body.
    // Use local variables for speed and defer state transitions via timeouts.
    const localTypingSpeed = isDeleting ? 30 : 50;

    if (isDeleting) {
      if (text === "") {
        // Defer the transition to avoid cascading renders
        timer = setTimeout(() => {
          setIsDeleting(false);
          setLoopNum((prev) => prev + 1);
        }, 100);
      } else {
        timer = setTimeout(() => {
          setText(fullText.substring(0, text.length - 1));
        }, localTypingSpeed);
      }
    } else {
      if (text === fullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 3000); // Wait 3 seconds before deleting
      } else {
        timer = setTimeout(() => {
          setText(fullText.substring(0, text.length + 1));
        }, localTypingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, messages]);

  return (
    <span>
      {text}
      <span className="animate-pulse ml-[1px]">|</span>
    </span>
  );
}
