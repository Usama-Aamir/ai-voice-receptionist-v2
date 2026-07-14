"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget({
  businessId,
  fullPage = false,
  businessName,
  businessPhone,
  placeholder = "Type in English, Bahasa Malaysia, Tamil, or Chinese…",
}: {
  businessId: string;
  fullPage?: boolean;
  businessName?: string;
  businessPhone?: string | null;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I'm your AI receptionist. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    const fallbackMessage = businessPhone
      ? `I'm having trouble responding right now — please try again in a moment, or contact us directly at ${businessPhone}.`
      : "I'm having trouble responding right now — please try again in a moment, or contact us directly.";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          businessId,
          message: userMessage,
          conversationHistory: messages,
          conversationId,
        }),
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || fallbackMessage },
        ]);
      }
    } catch {
      clearTimeout(timeoutId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fallbackMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        fullPage
          ? "flex h-screen flex-col items-center justify-center p-4"
          : "fixed bottom-6 right-6 z-50 flex flex-col items-end"
      }
    >
      {(isOpen || fullPage) && (
        <div
          className={`flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm ${
            fullPage
              ? "h-full w-full max-w-2xl"
              : "mb-4 w-[360px]"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-medium text-text-primary">
              {fullPage
                ? `Chat with ${businessName ?? "us"}`
                : "Preview your AI receptionist"}
            </span>
            {!fullPage && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Close
              </button>
            )}
          </div>

          <div
            className={`flex flex-col gap-3 overflow-y-auto p-4 ${
              fullPage ? "flex-1" : "h-80"
            }`}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "self-end bg-accent text-bg"
                    : "self-start border border-border bg-bg text-text-primary"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="self-start rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-secondary">
                Thinking…
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-60"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {!fullPage && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-bg shadow-sm transition-colors hover:bg-accent/90"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <span className="text-lg">×</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
