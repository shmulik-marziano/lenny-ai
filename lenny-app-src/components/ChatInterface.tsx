"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "שלום, אני לני 👋\n\nשלח לי תיאור של ליקוי שקיבלת מחברת ביטוח ואני אזהה מה צריך לתקן.\n\nאפשר גם להדביק את תוכן המייל כמו שהוא.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fixCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const FREE_LIMIT = 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || data.error || "שגיאה לא צפויה",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "שגיאת חיבור. נסה שוב.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-lenny-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lenny-cyan flex items-center justify-center text-lenny-dark font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="font-bold text-lg">LENNY</h1>
            <p className="text-xs text-gray-500">תיקון ליקויים — FIX</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {fixCount}/{FREE_LIMIT} תיקונים חינם
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-lenny-cyan/10 text-gray-100 border border-lenny-cyan/20"
                  : "bg-lenny-card text-gray-200 border border-lenny-border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-lenny-card border border-lenny-border rounded-2xl px-4 py-3 text-sm text-gray-400">
              <span className="animate-pulse">לני חושב...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-lenny-border px-4 py-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="תאר את הליקוי שקיבלת..."
            rows={1}
            className="flex-1 bg-lenny-card border border-lenny-border rounded-xl px-4 py-3 text-sm
                       text-gray-100 placeholder-gray-500 resize-none focus:outline-none
                       focus:border-lenny-cyan/50 transition-colors"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="bg-lenny-cyan text-lenny-dark font-bold px-4 py-3 rounded-xl
                       hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all text-sm shrink-0"
          >
            שלח
          </button>
        </div>
      </div>
    </div>
  );
}
