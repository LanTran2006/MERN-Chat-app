import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { axios } from "@/app/utils/axios";

export async function GET() {
  const cookieStore = await cookies();
   let res;
    const token = cookieStore.get("token")?.value;
    res= await axios.get("/auth/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    const response = NextResponse.json({ message: res.message },{status: res.status});
    cookieStore.delete("token");
    return response;
}
