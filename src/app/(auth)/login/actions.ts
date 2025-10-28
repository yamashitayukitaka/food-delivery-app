'use server'
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation'

export async function login() {

  //googleログイン
  console.log('google login');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}

