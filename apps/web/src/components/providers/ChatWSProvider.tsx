"use client";
import { refreshToken } from "@/lib/auth";
import { getSession } from "@/lib/session";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// Adjust the type as needed
type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const ChatWSProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
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
    if (token && !socket && typeof window !== "undefined") {
      const backend = io("http://localhost:8000/chat", {
        transports: ["websocket"],
        auth: {
          token
        }
      })

      setSocket(backend)
    }

    return () => {
      socket?.disconnect();
    };
  }, [token]); // Add session as dependency

  // useEffect(() => {
  //   socket?.on('')
  // }, [socket])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};