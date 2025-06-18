'use server';

import { B_URL } from "./constants";
import { getSession, updateTokens } from "./session";
import { FetchOptions } from "./types";


export const refreshToken = async (oldRefToken: string) => {
  try {
    const res = await fetch(`${B_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        'Content-Type':'application/json',
        'authorization': `Bearer ${oldRefToken}`
      }
    })

    if(!res.ok) {throw new Error('refreshToken - failed')}

    const {accessToken, refreshToken} = await res.json()

    const updateRes = await fetch('http://localhost:3000/api/auth/update', {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken
      })
    });

    if (!updateRes.ok) throw new Error('failed to update the tokens')

    return accessToken
  } catch (err)  {
    console.log('RefreshTokenFailed')
    return null
  }
}

export const authFetch = async (url: string |URL, options: FetchOptions = {}) => {
  const session = await getSession()

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`
  }

  let response = await fetch(url, options)

  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error('ref token not found');

    const newAccessToken = await refreshToken(session.refreshToken)

    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`
      response = await fetch(url, options)
    }
  }
  return response
}