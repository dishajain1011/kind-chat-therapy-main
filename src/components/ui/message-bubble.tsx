import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
  className?: string;
}

export function MessageBubble({ message, isUser, timestamp, className }: MessageBubbleProps) {
  return (
    <div 
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div className={cn("flex flex-col max-w-[80%] md:max-w-[70%]")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-message transition-all",
            isUser 
              ? "bg-bubble-user text-bubble-user-foreground rounded-br-sm ml-4" 
              : "bg-bubble-therapist text-bubble-therapist-foreground border border-border rounded-bl-sm mr-4"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        
        {timestamp && (
          <p className={cn(
            "text-xs text-muted-foreground mt-1 px-2",
            isUser ? "text-right" : "text-left"
          )}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}