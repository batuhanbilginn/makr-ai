import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { Database } from "@/types/supabase";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  const supabase = createMiddlewareSupabaseClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && pathname.startsWith("/chat")) {
    const url = new URL(req.url);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (session && (pathname === "/" || pathname === "/#")) {
    const url = new URL(req.url);
    url.pathname = "/chat";
    return NextResponse.redirect(url);
  }

  return res;
}
