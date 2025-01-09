"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, ArrowLeft } from "lucide-react";

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

  // useEffect(() => {
  //   const savedMessages = localStorage.getItem("chatMessages");
  //   if (savedMessages) {
  //     setMessages(JSON.parse(savedMessages));
  //   }
  // }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // localStorage.setItem("chatMessages", JSON.stringify(messages));
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-violet-100 to-pink-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b backdrop-blur-lg bg-white/50">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="text-white hover:text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>
        <h1 className="ml-4 text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
          TrendLytix
        </h1>
      </header>
      <main className="flex-1 p-2 sm:p-4 md:p-6 flex justify-center">
        <Card className="w-full max-w-4xl flex flex-col h-[90vh] sm:h-[85vh] bg-white/50 backdrop-blur-lg border-none shadow-lg">
          <CardHeader className="border-b bg-white/50">
            <CardTitle className="text-lg sm:text-xl text-gray-700">
              Chat with Your Analytics AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-2 sm:p-4 h-[calc(90vh-10rem)] sm:h-[calc(85vh-8rem)]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-6 h-6 text-xs md:text-base sm:w-8 sm:h-8 border-2 border-white/50">
                      <AvatarFallback
                        className={
                          message.role === "user"
                            ? "bg-indigo-500 text-white"
                            : "bg-violet-500 text-white"
                        }
                      >
                        {message.role === "user" ? "U" : "AI"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`p-2 sm:p-3 rounded-2xl text-sm sm:text-base ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                          : "bg-white/80 text-gray-800 shadow-sm"
                      } whitespace-pre-wrap`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] flex-row">
                  <Avatar className="w-6 h-6 text-xs md:text-base sm:w-8 sm:h-8 border-2 border-white/50">
                    <AvatarFallback className="bg-violet-500 text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-2 sm:p-3 rounded-2xl text-sm sm:text-base bg-white/80 text-gray-800 shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-2 sm:p-4 border-t bg-white/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your social media analytics..."
                  className="flex-1 bg-white/50 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-indigo-600 text-sm sm:text-base"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
