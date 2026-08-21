'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { IdeoraStore } from '@/lib/storage/store';
import { createClient } from '@/lib/supabase/client';
import { GoogleDriveService } from '@/lib/google-drive/client';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const client = createClient();
      if (client) {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario Google',
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            createdAt: session.user.created_at,
          };
          setUser(profile);
          IdeoraStore.setUser(profile);
          setLoading(false);
          return;
        } else {
          // If Supabase is active but no session, set user to null (guest)
          setUser(null);
          setLoading(false);
          return;
        }
      }

      // Fallback local user ONLY if Supabase is not configured (offline / mock mode)
      const localUser = IdeoraStore.getUser();
      setUser(localUser);
      setLoading(false);
    }

    loadSession();
  }, []);

  const loginWithGoogle = async () => {
    const client = createClient();
    if (client) {
      await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/drive.file',
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return;
    }

    // Interactive Google OAuth Fallback
    const gUser: UserProfile = {
      id: `usr_google_${Date.now()}`,
      email: 'jose.google@gmail.com',
      displayName: 'José (Google)',
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      createdAt: new Date().toISOString(),
    };
    setUser(gUser);
    IdeoraStore.setUser(gUser);

    // Automatically connect Google Drive session
    await GoogleDriveService.connectAccount('jose.google@gmail.com');
  };

  const loginWithDemo = () => {
    const demo = IdeoraStore.getUser();
    setUser(demo);
  };

  const logout = async () => {
    const client = createClient();
    if (client) {
      await client.auth.signOut();
    }
    GoogleDriveService.disconnect();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithDemo,
    logout,
  };
}
