import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (!res.ok) throw new Error('Registration failed');
      const data = await res.json();
      login(data.access_token);
      navigate('/app');
    } catch (err) {
      setError('Failed to register. Email might be in use.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit">Sign Up</Button>
      </form>
      <p className="text-center mt-6 text-slate-600 text-sm">Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link></p>
    </div>
  );
}
