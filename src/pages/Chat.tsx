import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageBubble } from "@/components/ui/message-bubble";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft, Send, User, Brain } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const therapistAttitudes = [
  { value: "supportive", label: "Supportive" },
  { value: "flirty", label: "Flirty" },
  { value: "tough-love", label: "Tough Love" },
  { value: "hype", label: "Hype" },
  { value: "professional", label: "Professional" },
  { value: "wise", label: "Wise" },
];

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:9090/therapist";

const Chat = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello Alex. I'm your AI therapist. I'm here to listen, support, and help you work through whatever's on your mind. How are you feeling today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attitude, setAttitude] = useState("supportive");
  const [promptCount, setPromptCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [email, setEmail] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  const maxPrompts = 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || sessionEnded) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    const newPromptCount = promptCount + 1;
    setPromptCount(newPromptCount);

    // Prepare user payload for API
    const apiUser = {
      id: user.id,
      name: userProfile.name,
      age: userProfile.age,
      gender: userProfile.gender,
      is_genz_enabled: userProfile.genZMode,
      traits: userProfile.traits,
    };

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/chat/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: apiUser,
          sessionId: sessionId,
          content: userMessage.content,
          therapistMode: attitude,
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
        const therapistMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, therapistMessage]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error contacting the therapist.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was a network error.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
    setIsLoading(false);

    // Check if session should end
    if (newPromptCount >= maxPrompts) {
      setSessionEnded(true);
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      // Mock API call
      console.log("Email submitted:", email);
      alert("Thank you! We'll notify you when the full version launches.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-gentle">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/onboard")}
              className="border-border/50 hover:border-primary/50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">{user.name || "User"}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                <span className="text-sm text-muted-foreground">AI Therapist</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={attitude} onValueChange={setAttitude}>
              <SelectTrigger className="w-48 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {therapistAttitudes.map(att => (
                  <SelectItem key={att.value} value={att.value}>
                    {att.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              {promptCount}/{maxPrompts}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-bubble-therapist border border-border rounded-2xl rounded-bl-sm px-4 py-3 mr-4">
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card/95 backdrop-blur-sm border-t border-border shadow-gentle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {sessionEnded ? (
            <Card className="border-primary/20 bg-gradient-therapeutic/5">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-foreground">
                  You've reached the end of this beta session!
                </CardTitle>
                <CardDescription>
                  Thanks for trying our AI Therapist beta. Want to help us scale? Leave your email and we'll let you know when we launch the full version.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Notify Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 transition-all focus:ring-primary/20"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 transition-colors text-primary-foreground px-6"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;