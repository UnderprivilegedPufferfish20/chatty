import { z } from 'zod'

export type Session = {
  user: {
    id: string,
    name: string
  },
  accessToken: string,
  refreshToken: string
}

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export type FriendCodeFormState = {
  error?: {
    code?: string
  },
  message?: string
} | undefined