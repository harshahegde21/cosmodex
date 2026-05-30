'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const PREMADE_AVATARS = {
  male: '/avatars/default-male.png',
  female: '/avatars/default-female.png',
  other: '/avatars/default-neutral.png',
};

export async function signUpUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const gender = (formData.get('gender') as string) || 'other';

  if (!email || !password || !username) {
    return { error: 'Email, username, and password are required.' };
  }

  // 0. Pre-check Prisma to prevent Supabase/Prisma inconsistency
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) return { error: 'Email is already in use.' };
    if (existingUser.username === username) return { error: 'Username is already taken.' };
  }

  const supabase = await createClient();

  // 1. Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: username,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Unknown error occurred during signup.' };
  }

  // 2. Select pre-made avatar based on gender
  const avatarUrl = PREMADE_AVATARS[gender as keyof typeof PREMADE_AVATARS] || PREMADE_AVATARS['other'];

  // 3. Sync user to Prisma database
  try {
    await prisma.users.create({
      data: {
        id: authData.user.id,
        email,
        username,
        auth_provider: 'email',
        avatar_url: avatarUrl,
        role: 'student',
      },
    });
  } catch (dbError) {
    console.error('Error syncing user to database:', dbError);
    return { error: 'Failed to create user profile in the database. Username or email might be taken.' };
  }

  // 4. Prevent auto-login: Sign the user out immediately just in case Supabase auto-logged them in (if email confirmations are off).
  await supabase.auth.signOut();

  // If session is null, Supabase requires email verification.
  if (!authData.session) {
    return { 
      success: true, 
      message: 'Signup successful! Please check your email to verify your account before logging in.'
    };
  }

  revalidatePath('/login');
  
  return { 
    success: true, 
    message: 'Signup successful! You can now log in.'
  };
}

export async function signInUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/login');
  return { success: true, redirectUrl: '/login' };
}
