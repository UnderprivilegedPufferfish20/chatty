'use server'

import { cookies } from "next/headers";
import { secretKey } from "./constants";
import { Session } from "./types";
import { jwtVerify, SignJWT } from 'jose'
import { redirect } from "next/navigation";

export async function createSession(payload: Session) {
  const cookiestore = await cookies()

  const expiredAt = new Date(Date.now() + 7*24*60*60*1000)

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg:'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
  
  cookiestore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: 'lax',
    path: '/'
  })
};

export async function getSession() {
  const cookiestore = await cookies()
  const cookie = cookiestore.get('session')

  if (!cookie) return null

  try {
    const { payload } = await jwtVerify(cookie.value, secretKey, {
      algorithms: ['HS256']
    })

    return payload as Session
  } catch (err) {
    console.log('Failed to verify session: ', err)
    redirect('/')
  }
};


export async function deleteSession() {
 (await cookies()).delete('session')
}

export async function updateTokens({
  accessToken, refreshToken
}:{accessToken:string, refreshToken: string}) {
  const cookiestore = await cookies()
  const cookie = cookiestore.get('session')

  if (!cookie) return null;

  const { payload } = await jwtVerify<Session>(cookie.value, secretKey)

  if (!payload) throw new Error("session not found")

  const newPayload: Session = {
    user: {
      ...payload.user
    },
    accessToken,
    refreshToken
  }

  await createSession(newPayload)


}