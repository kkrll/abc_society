export type SupabaseUser = {
  id: string;
  aud: string;
  email?: string;
  role?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
};
