import { createSession, deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const userId = searchParams.get('userId')
  const name = searchParams.get('name')

  if (!accessToken || !refreshToken || !userId || !name) {
    throw new Error("Google login failed: missing data")
  }

  await createSession({
    user: {
      name: name,
      id: userId
    },
    accessToken,
    refreshToken
  })

  redirect('/dashboard')
}