export const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET_KEY!)

export const B_URL:string = process.env.NEXT_PUBLIC_BACKEND_URL!
