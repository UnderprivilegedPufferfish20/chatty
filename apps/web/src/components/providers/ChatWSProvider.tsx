"use client";
import { getSession } from "@/lib/session";
import { Session } from "@/lib/types";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Adjust the type as needed
type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const ChatWSProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const attainSession = async () => {
      const s = await getSession();
      if (!s) throw new Error("ChatWSProvider - no session :(");
      
      setSession(s);
    };
    attainSession();
  }, []);

  useEffect(() => {
    // Only create socket connection if we have a session and no existing socket
    if (session && !socketRef.current && typeof window !== "undefined") {
      socketRef.current = io("http://localhost:8000/chat", {
        transports: ["websocket"],
        auth: {
          userId: session.user.id
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [session]); // Add session as dependency

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};