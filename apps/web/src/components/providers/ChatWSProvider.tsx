"use client";
import { refreshToken } from "@/lib/auth";
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
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getCreds = async () => {
      const s = await getSession();
      if (!s) throw new Error("ChatWSProvider - no session :(");

      const token = await refreshToken(s.refreshToken)

      if (!token) throw new Error("ChatWSProvider - refreshToken failed :(")
      
      setToken(token);
    };
    getCreds();
  }, []);

  useEffect(() => {
    // Only create socket connection if we have a session and no existing socket
    if (token && !socketRef.current && typeof window !== "undefined") {
      socketRef.current = io("http://localhost:8000/chat", {
        transports: ["websocket"],
        auth: {
          token
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]); // Add session as dependency

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};