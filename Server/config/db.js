import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseURL, serviceRoleKey, {
    auth:{
        autoRefreshToken:false,
        persistSession:false
    }
});
console.log("Supabase connected");
export default supabase;