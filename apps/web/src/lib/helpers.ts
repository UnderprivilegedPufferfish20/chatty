"use server"

import { authFetch } from "./auth";
import { B_URL } from "./constants";

export async function getOtherUserFromFriendRel(
  currentUserId: string, 
  friendRelId: string
) {
  const friendRel = await authFetch(
    `${B_URL}/friends?relId=${friendRelId}`,
    { method: "GET" }
  );

  const otherUser = friendRel.user.id === currentUserId 
    ? friendRel.friend 
    : friendRel.user;
  
  return {
    id: otherUser.id,
    name: otherUser.name,
    latestChat: friendRel.chats[0]?.message ?? "No chat history. Say Hi Now!"
  };
}

export async function getUserFriends(userId: string) {
  const user = await authFetch(`${B_URL}/user?id=${userId}`, { method: "GET" });
  
  // Get unique friend relation IDs
  const allFriendRelations = [...user.friends, ...user.friendsOf];
  const uniqueFriendRelIds = [...new Set(allFriendRelations.map(f => f.id))];
  
  // Fetch all friends in parallel for better performance
  const friendsPromises = uniqueFriendRelIds.map(relId => 
    getOtherUserFromFriendRel(userId, relId)
  );
  
  return Promise.all(friendsPromises);
}