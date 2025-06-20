"use server"

import { authFetch } from "./auth";
import { B_URL } from "./constants";
import { getSession } from "./session";
import { FriendCodeFormState } from "./types";

export async function addFriend(
  state: FriendCodeFormState,
  formData: FormData
): Promise<FriendCodeFormState> {
  const code = formData.get('code')

  if (typeof code !== 'string') throw new Error("addFriend - couldn't get code");

  if (!/^[A-Z0-9]{6}$/.test(code)) {
    return {
      error: {
        code: "Must be 6 characters long, uppercase letters or numbers"
      }
    }
  }

  const s = await getSession()
  if (!s) throw new Error();

  const userData = await authFetch(`${B_URL}/user?friendCode=${formData.get('code')}`,{method:"GET"})

  if (!userData) {
    return {
      error: {code:"That user does not exist"}
    }
  }

  const res = await authFetch(`${B_URL}/friends`, {
    method: "POST",
    body: JSON.stringify({
      userId: s.user.id,
      friendId: userData.id
    })
  })

  if (res.message === 'These two users are already friends') {
    return {
      error:{code: `You are already friends with ${userData.name}`}
    }
  }

  if (res.message === 'A user cannot be friends with themselves') {
    return {
      error: {code:"You cannot add yourself as a friend"}
    }
  }

  return {
    message: `You are now friends with ${userData.name}`
  }
}