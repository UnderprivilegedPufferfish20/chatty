import React from 'react'

const Message = ({ isUser, isTyping, message }: { isUser: boolean, isTyping: boolean, message?: string }) => {
  return (
    <div className={`w-full p-2 flex items-center ${isUser ? 'justify-end' : "justify-start"}`}>
      {
        isTyping ? (
          <TypingBubble />
        ) : (
          <ChatBubble message={message!} isUser={isUser}/>
        )
      }
    </div>
  )
}

export default Message


function TypingBubble({ 
  className = "",
  dotColor = "#9ca3af",
  backgroundColor = "#e5e7eb"
}: { 
  className?: string;
  dotColor?: string;
  backgroundColor?: string;
}) {
  return (
    <div 
      className={`inline-flex items-center px-4 py-3 rounded-full ${className}`}
      style={{ backgroundColor }}
    >
      <div className="flex space-x-1">
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '0ms',
            animationDuration: '1.4s'
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '150ms',
            animationDuration: '1.4s'
          }}
        />
        <div 
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ 
            backgroundColor: dotColor,
            animationDelay: '300ms',
            animationDuration: '1.4s'
          }}
        />
      </div>
    </div>
  );
}


function ChatBubble({ 
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