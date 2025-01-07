"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const parseResponse = (content: string): string => {
  // Replace double stars with nothing
  const cleanedContent = content.replace(/\*\*/g, "");

  // Replace stars (*) with bullet points (•)
  const bulletPoints = cleanedContent.replace(/^\s*\*/gm, "•");

  // Add a new line before the first bullet point without using the /s flag
  const firstBulletPointIndex = bulletPoints.indexOf("•");
  if (firstBulletPointIndex !== -1) {
    return (
      bulletPoints.slice(0, firstBulletPointIndex) + // Text before the first bullet point
      "\n" + // Add a new line
      bulletPoints.slice(firstBulletPointIndex) // Text from the first bullet point onward
    );
  }

  return bulletPoints; // If no bullet points exist, return as is
};

const flowId = process.env.NEXT_PUBLIC_FLOW_ID!;
const langflowId = process.env.NEXT_PUBLIC_LANGFLOW_ID!;

export default function QueryInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI analytics assistant. How can I help you analyze your social media data today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Remove or comment out the local LangflowClient definition
  // const langflowClient = new LangflowClient(...);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Please enter a valid query." },
      ]);
      return;
    }

    if (isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our new /api/rag endpoint
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowId: flowId,
          langflowId: langflowId,
          inputValue: input,
          inputType: "chat",
          outputType: "chat",
          tweaks: {
            "Prompt-uBxb1": {},
            // ... your other tweaks
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || "Unknown error from /api/rag");
      }

      // Based on how your API returns data, you can adjust this:
      const assistantMessage: Message = {
        role: "assistant",
        content: parseResponse(
          data.outputs[0].outputs[0].outputs.message.message.text
        ),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error fetching response:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while processing your query.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Button variant="ghost" onClick={() => router.push("/")}>
          Back to Home
        </Button>
        <h1 className="ml-4 text-lg font-semibold">AI Analytics Assistant</h1>
      </header>
      <main className="flex-1 p-4 md:p-6 flex justify-center">
        <Card className="w-full max-w-4xl flex flex-col h-full">
          <CardHeader>
            <CardTitle>Chat with Your Analytics AI</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      } whitespace-pre-wrap`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex items-center mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your social media analytics..."
                className="flex-1 mr-2"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
