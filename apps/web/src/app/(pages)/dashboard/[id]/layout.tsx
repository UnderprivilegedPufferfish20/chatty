import ChatPage from "@/components/pages/ChatPage";
import { authFetch } from "@/lib/auth";
import { B_URL } from "@/lib/constants";
import { getSession } from "@/lib/session";
import React from "react";

export default async function ChatLayout({children, params}:{children:React.ReactNode, params:{id:string}}) {
  const receiverId = params.id
  const session = await getSession()
  if (!session) throw new Error();
  const user = await authFetch(`${B_URL}/user?id=${session.user.id}`)
  const receiver = await authFetch(`${B_URL}/user?id=${receiverId}`)
  const friendRel = await authFetch(`${B_URL}/friends?personOneID=${session.user.id}&personTwoID=${receiverId}`)


  return (
    <div className="h-full">
      <ChatPage 
        friendRel={friendRel}
        receiver={receiver}
        user={user}
      />
    </div>
  )
}