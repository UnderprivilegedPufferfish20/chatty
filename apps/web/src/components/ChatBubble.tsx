export function ChatBubble({ 
  message, 
  isUser = false,
  className = ""
}: { 
  message: string;
  isUser?: boolean;
  className?: string;
}) {
  return (
    <div 
      className={`max-w-xs px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-blue-500 text-white ml-auto' 
          : 'bg-gray-200 text-gray-800'
      } ${className}`}
    >
      {message}
    </div>
  );
}