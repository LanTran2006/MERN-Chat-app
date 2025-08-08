
import { getTokenExpiry } from "@/app/utils/token";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accessToken } = body;

    const expiresIn = getTokenExpiry(accessToken);
    if (expiresIn === null || expiresIn <= 0) {
      return new Response("Invalid or expired token", { status: 400 });
    }
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: accessToken,
      httpOnly: true,
      secure: true,
      maxAge: expiresIn,
      sameSite: "lax",
    });
    return Response.json({ message: "Successfully set cookie" });
  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}
