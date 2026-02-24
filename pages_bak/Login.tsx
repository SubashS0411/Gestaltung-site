
import React, { useState } from 'react';
// Fix: Use standard Latin characters for react-router-dom imports to ensure compatibility with the build environment
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { supabase, isDemoMode } from '../lib/supabase';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (isDemoMode) {
      // Automatic login for demo mode
      const demoUser = {
        id: 'demo-user-123',
        email: email || 'designer@example.com',
        name: 'Demo Designer'
      };
      setUser(demoUser);
      navigate('/dashboard');
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-3xl glass-morphism border border-white/10">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Login</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Welcome back to Gestaltung</p>
        
        {isDemoMode && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl text-center font-bold uppercase tracking-widest">
            Demo Mode Active: Enter any credentials
          </div>
        )}

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
              placeholder="name@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all uppercase text-xs tracking-widest">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          New here? <Link to="/signup" className="text-emerald-400 hover:underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
