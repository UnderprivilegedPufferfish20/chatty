'use server';

import { B_URL } from "./constants";
import { getSession, updateTokens } from "./session";
import { FetchOptions } from "./types";


export const refreshToken = async (oldRefToken: string) => {
  try {
    const res = await fetch(`${B_URL}/auth/refresh`, {
      method: "GET",
      headers: {
        'Content-Type':'application/json',
        'authorization': `Bearer ${oldRefToken}`
      }
    })

    if(!res.ok) {
      console.log(res.statusText)
      throw new Error('refreshToken - failed')
    }

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
    console.log('RefreshTokenFailed', err)
    return null
  }
}

export const authFetch = async (url: string | URL, options: FetchOptions = {}) => {
  const session = await getSession();
  if (!session) throw new Error("Auth fetch - no session");

  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${session.accessToken}`,
    "Content-Type": 'application/json'
  };

  let response = await fetch(url, options);


  if (response.status === 401) {
    if (!session?.refreshToken) throw new Error('Refresh token not found');
    
    const newAccessToken = await refreshToken(session.refreshToken);
    if (newAccessToken) {
      options.headers.Authorization = `Bearer ${newAccessToken}`;
      response = await fetch(url, options);
    }
  }


  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');

  if (contentLength === '0' || response.status === 204) {
    return null;
  }
  

  if (!contentType?.includes('application/json')) {
    return await response.text();
  }


  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    throw new Error('Invalid JSON response');
  }
};