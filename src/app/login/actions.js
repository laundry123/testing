'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "../../utils/Supabase/server"

export async function login(formData) {
  const supabase = await createClient()

  const data = {
      email: formData.get('email'),
      password: formData.get('password'),
  };

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
      // Handle invalid login credentials
      if (signInError.message === 'Invalid login credentials') {
          redirect('/login?message=Email atau password salah');
      } else {
          redirect('/error');
      }
      return;
  }

  // Assuming 'signInData.user' contains the authenticated user information
  const user = signInData.user;

  if (!user) {
      redirect('/error');
      return;
  }

  // Fetch user role from the 'roles' table
  const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
  
  if (roleError || !roleData) {
      redirect('/home');
      return;
  }
  // Redirect based on the role
  if (roleData.role === 'admin') {
      redirect('/admin/profilAdmin');  // Admin gets redirected to the admin page
  } else if (roleData.role === 'user') {
      redirect('/home_user');   // Regular user gets redirected to the user page
  } else {
      redirect('/error');  // Handle any other case, just in case there are unexpected roles
  }
}
export async function signup(formData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    const {data: signUpData, error} = await supabase.auth.signUp(data)

    if (error) {
        redirect('/error')
    }

    if (signUpData?.user?.identities?.length === 0) {
        redirect('/login?message=Email already registered')
    }

    redirect('/login?message=Check your email to confirm your account')
}

export async function signout() {
    const supabase = await createClient()

    const {error} = await supabase.auth.signOut()

    if (error) {
        redirect('/error')
    }
    revalidatePath('/', 'layout')
    redirect('/login')
}