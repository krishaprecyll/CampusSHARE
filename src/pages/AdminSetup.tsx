import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, CheckCircle } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AdminSetup() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const setupAdmin = async () => {
    setStatus('loading');
    try {
      // Check if admin already exists
      const { data: existingAuth } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: 'admin123',
      });

      if (existingAuth.user) {
        setMessage('Admin user already exists and is ready to login');
        setStatus('success');
        return;
      }
    } catch (err) {
      // User doesn't exist, try to create
    }

    try {
      // Try to sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@gmail.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Administrator',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Update the user profile to set role as admin
        const { error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin', verified: true })
          .eq('id', data.user.id);

        if (updateError) throw updateError;

        setMessage('Admin user created successfully! You can now login with admin@gmail.com / admin123');
        setStatus('success');

        // Auto logout after showing message
        setTimeout(() => {
          supabase.auth.signOut();
        }, 2000);
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to setup admin user');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Admin Setup</h1>
        <p className="text-slate-600 mb-8">Initialize the admin account for CampusSHARE</p>

        {status === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{message}</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-blue-700 text-sm">
              <strong>Credentials:</strong>
              <br />
              Email: admin@gmail.com
              <br />
              Password: admin123
            </p>
          </div>
        )}

        <button
          onClick={setupAdmin}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Setting up...' : 'Create Admin Account'}
        </button>

        <p className="text-center text-slate-600 text-xs mt-6">
          After setup completes, navigate to /admin/login to access the admin dashboard
        </p>
      </div>
    </div>
  );
}
