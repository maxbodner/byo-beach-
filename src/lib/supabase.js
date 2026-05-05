import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch all approved pins
export async function fetchApprovedPins() {
  const { data, error } = await supabase
    .from('pins')
    .select('id, lat, lng, first_name, beach_name, state, note')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pins:', error)
    return []
  }
  return data || []
}

// Fetch total count for the social proof line
export async function fetchPinCount() {
  const { count, error } = await supabase
    .from('pins')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  if (error) {
    console.error('Error counting pins:', error)
    return 0
  }
  return count || 0
}

// Submit a new pin (status defaults to 'pending' or 'approved' based on DB config)
export async function submitPin(pin) {
  const { data, error } = await supabase
    .from('pins')
    .insert([{
      lat: pin.lat,
      lng: pin.lng,
      first_name: pin.firstName.trim(),
      beach_name: pin.beachName.trim(),
      state: pin.country.trim(),
      note: pin.note?.trim() || null,
    }])
    .select()

  if (error) {
    console.error('Error submitting pin:', error)
    throw new Error(error.message)
  }
  return data?.[0]
}
