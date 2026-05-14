import { supabase } from './supabase';

// ─── User Profile ───
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  gender: string | null;
  is_visually_impaired: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Get user profile ───
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

// ─── Create or update user profile ───
export async function upsertUserProfile(userId: string, updates: {
  full_name?: string;
  email?: string;
  gender?: string;
  is_visually_impaired?: boolean;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// ─── Update user profile ───
export async function updateUserProfile(userId: string, updates: {
  full_name?: string;
  email?: string;
  gender?: string;
  is_visually_impaired?: boolean;
}) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as UserProfile;
}

// ─── Save a route ───
export async function saveRoute(
  userId: string,
  origin: string,
  destination: string,
  routeType: 'ShadowPath' | 'SafePath' | 'AirSense' | 'Fastest'
) {
  const { data, error } = await supabase
    .from('saved_routes')
    .insert({ user_id: userId, origin_name: origin, destination_name: destination, route_type: routeType })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Get saved routes for a user ───
export async function getSavedRoutes(userId: string) {
  const { data, error } = await supabase
    .from('saved_routes')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ─── Delete a saved route ───
export async function deleteSavedRoute(routeId: string) {
  const { error } = await supabase
    .from('saved_routes')
    .delete()
    .eq('id', routeId);

  if (error) throw error;
}

// ─── Submit a citizen report ───
export async function submitReport(
  userId: string,
  category: 'safety' | 'infrastructure' | 'pollution' | 'other',
  description: string,
  lat: number,
  lng: number
) {
  const { data, error } = await supabase
    .from('citizen_reports')
    .insert({ user_id: userId, category, description, lat, lng })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Get all reports (public) ───
export async function getReports() {
  const { data, error } = await supabase
    .from('citizen_reports')
    .select('*')
    .order('reported_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}
