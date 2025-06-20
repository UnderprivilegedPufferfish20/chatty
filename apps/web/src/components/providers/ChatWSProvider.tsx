"use client";
import { refreshToken } from "@/lib/auth";
import { getSession } from "@/lib/session";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => {
  return useContext(SocketContext).socket;
};

export const ChatWSProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token on mount
  useEffect(() => {
    const getCreds = async () => {
      try {
        const session = await getSession();
        if (!session) throw new Error("No session found");

        const newToken = await refreshToken(session.refreshToken);
        if (!newToken) throw new Error("Failed to refresh token");

        setToken(newToken);
      } catch (error) {
        console.error("Failed to initialize WebSocket credentials:", error);
      }
    };
    getCreds();
  }, []);

  // Initialize socket when token is available
  useEffect(() => {
    if (!token || typeof window === "undefined") return;

    const newSocket = io("http://localhost:8000/chat", {
      transports: ["websocket"],
      auth: { token },
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket server | ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Connection failed:", err.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("⚠️ Disconnected:", reason);
    });

    setSocket(newSocket);

    // Cleanup on unmount or token change
    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.disconnect();
    };
  }, [token]); // Only re-run if token changes

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};