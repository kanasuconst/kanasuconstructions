import { supabase } from './supabase-config.js';

// IMPORTANT: After creating your admin user in Firebase Authentication, add their UID to the Firestore 'admins' collection as a document with a field 'uid'.
// Example: { uid: "YOUR_ADMIN_UID" }
// This ensures only the admin can log in to the dashboard.

// Admin login function
export async function adminLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { success: !!data.user, user: data.user, error: error ? error.message : null };
}

// Admin logout function
export async function adminLogout() {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error: error ? error.message : null };
}

// Admin reset password function
export async function adminResetPassword(newPassword) {
    try {
        // Get current session to ensure user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
            return { success: false, error: 'No active session found' };
        }
        
        // Update password using Supabase auth
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        
        if (error) {
            return { success: false, error: error.message };
        }
        
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message || 'Failed to update password' };
    }
} 