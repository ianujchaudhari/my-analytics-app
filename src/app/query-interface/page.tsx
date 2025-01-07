"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react"; // Ensure this import is correct
import LangflowClient from "@/utils/LangflowClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}
 

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

  const langflowClient = new LangflowClient(
    "https://api.langflow.astra.datastax.com",
    "AstraCS:ONNXLyQLtZCIXZuiwIeQvAFu:df8e372358fb3c2e744392fd0211e3b0066e6b8d8223d8c0149e8bba453d95e3"
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Replace with actual API call
    try {

      const tweaks = {
        "Prompt-uBxb1": {},
        "SplitText-oipej": {},
        "AstraDB-viQgD": {},
        "File-rZi3k": {},
        "GroqModel-EV7Wo": {},
        "ChatOutput-wIeA7": {},
        "ParseData-ejneO": {},
        "ChatInput-atY9u": {},
        "CombineText-hbhRv": {},
      };

      const result = await langflowClient.runFlow(
        "86e5d8b9-d81f-4658-ad9d-4c94758011ac", // flowId
        "01d3ed92-87e8-4377-b1db-72b1aff1de65", // langflowId
        input,
        "chat", // inputType
        "chat", // outputType
        tweaks,
        false, // stream (set to true for streaming responses)
        (data: any) => console.log("Received Stream:", data), // onUpdate
        (message: any) => console.log("Stream Closed:", message), // onClose
        (error: any) => console.error("Stream Error:", error) // onError
      );

      if (result && result.outputs) {
        const assistantMessage: Message = {
          role: "assistant",
          content: result.outputs[0].outputs[0].outputs.message.message.text,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
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

    //   const response = await new Promise<Message>((resolve) =>
    //     setTimeout(() => {
    //       resolve({
    //         role: "assistant",
    //         content: `Here's an analysis based on your query "${input}": [Simulated response with insights about social media engagement, post performance, etc.]`,
    //       });
    //     }, 1000)
    //   );
    //   setMessages((prev) => [...prev, response]);
    // } catch (error) {
    //   console.error("Error fetching response:", error);
    // } finally {
    //   setIsLoading(false);
    // }
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
                      }`}
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
