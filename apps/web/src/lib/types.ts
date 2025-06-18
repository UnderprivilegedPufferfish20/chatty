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