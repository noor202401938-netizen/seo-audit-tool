import os

def w(path, content):
    with open(path, w, encoding=utf-8) as f:
        f.write(content)

landing = "import { motion } from \u0027framer-motion\u0027;
import { Link } from \u0027react-router-dom\u0027;
import { Button } from \u0027../components/ui/button\u0027;

export default function LandingPage() {
  return (
    <div className=\u0022flex flex-col items-center justify-center py-24 px-6 text-center space-y-12\u0022>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className=\u0022text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6\u0022>
          Audit Smarter, <span className=\u0022text-indigo-600\u0022>Rank Higher.</span>
        </h1>
        <p className=\u0022text-xl text-slate-600 max-w-2xl mx-auto mb-10\u0022>
          The Universal SEO Auditor analyzes 251 technical rules across your entire site. Get actionable AI-driven strategies to dominate search results.
        </p>
        <Link to=\u0022/signup\u0022>
          <Button size=\u0022lg\u0022 className=\u0022bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg rounded-xl\u0022>Start Free Trial</Button>
        </Link>
      </motion.div>

      <div className=\u0022grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full pt-16\u0022>
        <div className=\u0022bg-white p-8 rounded-2xl shadow-sm border border-slate-100\u0022>
          <h3 className=\u0022text-xl font-bold mb-3\u0022>251-Rule Engine</h3>
          <p className=\u0022text-slate-600\u0022>Enterprise-grade scanning covering Core Web Vitals, Accessibility, and Technical SEO.</p>
        </div>
        <div className=\u0022bg-white p-8 rounded-2xl shadow-sm border border-slate-100\u0022>
          <h3 className=\u0022text-xl font-bold mb-3\u0022>AI Roadmaps</h3>
          <p className=\u0022text-slate-600\u0022>Don\u0027t just see what\u0027s broken. Get step-by-step Gemini-powered instructions on how to fix it.</p>
        </div>
        <div className=\u0022bg-white p-8 rounded-2xl shadow-sm border border-slate-100\u0022>
          <h3 className=\u0022text-xl font-bold mb-3\u0022>Deep Crawling</h3>
          <p className=\u0022text-slate-600\u0022>Spider through your entire architecture, not just the homepage, to catch hidden canonical and indexing issues.</p>
        </div>
      </div>
    </div>
  );
}"

login = "import { useState } from \u0027react\u0027;
import { useAuth } from \u0027../contexts/AuthContext\u0027;
import { useNavigate, Link } from \u0027react-router-dom\u0027;
import { Button } from \u0027../components/ui/button\u0027;
import { Input } from \u0027../components/ui/input\u0027;

export default function Login() {
  const [email, setEmail] = useState(\u0027\u0027);
  const [password, setPassword] = useState(\u0027\u0027);
  const [error, setError] = useState(\u0027\u0027);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append(\u0027username\u0027, email);
    formData.append(\u0027password\u0027, password);
    try {
      const res = await fetch(\u0027http://127.0.0.1:8000/api/auth/login\u0027, {
        method: \u0027POST\u0027,
        headers: { \u0027Content-Type\u0027: \u0027application/x-www-form-urlencoded\u0027 },
        body: formData
      });
      if (!res.ok) throw new Error(\u0027Invalid credentials\u0027);
      const data = await res.json();
      login(data.access_token);
      navigate(\u0027/app\u0027);
    } catch (err) {
      setError(\u0027Failed to login. Please check your credentials.\u0027);
    }
  };

  return (
    <div className=\u0022max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-sm border border-slate-200\u0022>
      <h2 className=\u0022text-3xl font-bold mb-6 text-center\u0022>Welcome Back</h2>
      <form onSubmit={handleSubmit} className=\u0022space-y-4\u0022>
        <Input type=\u0022email\u0022 placeholder=\u0022Email\u0022 value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type=\u0022password\u0022 placeholder=\u0022Password\u0022 value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className=\u0022text-red-500 text-sm\u0022>{error}</p>}
        <Button className=\u0022w-full bg-indigo-600 hover:bg-indigo-700\u0022 type=\u0022submit\u0022>Login</Button>
      </form>
      <p className=\u0022text-center mt-6 text-slate-600 text-sm\u0022>Don\u0027t have an account? <Link to=\u0022/signup\u0022 className=\u0022text-indigo-600 font-medium\u0022>Sign up</Link></p>
    </div>
  );
}"

signup = "import { useState } from \u0027react\u0027;
import { useAuth } from \u0027../contexts/AuthContext\u0027;
import { useNavigate, Link } from \u0027react-router-dom\u0027;
import { Button } from \u0027../components/ui/button\u0027;
import { Input } from \u0027../components/ui/input\u0027;

export default function Signup() {
  const [email, setEmail] = useState(\u0027\u0027);
  const [password, setPassword] = useState(\u0027\u0027);
  const [name, setName] = useState(\u0027\u0027);
  const [error, setError] = useState(\u0027\u0027);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(\u0027http://127.0.0.1:8000/api/auth/register\u0027, {
        method: \u0027POST\u0027,
        headers: { \u0027Content-Type\u0027: \u0027application/json\u0027 },
        body: JSON.stringify({ email, password, name })
      });
      if (!res.ok) throw new Error(\u0027Registration failed\u0027);
      const data = await res.json();
      login(data.access_token);
      navigate(\u0027/app\u0027);
    } catch (err) {
      setError(\u0027Failed to register. Email might be in use.\u0027);
    }
  };

  return (
    <div className=\u0022max-w-md mx-auto mt-24 bg-white p-8 rounded-2xl shadow-sm border border-slate-200\u0022>
      <h2 className=\u0022text-3xl font-bold mb-6 text-center\u0022>Create an Account</h2>
      <form onSubmit={handleSubmit} className=\u0022space-y-4\u0022>
        <Input type=\u0022text\u0022 placeholder=\u0022Name\u0022 value={name} onChange={e => setName(e.target.value)} required />
        <Input type=\u0022email\u0022 placeholder=\u0022Email\u0022 value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type=\u0022password\u0022 placeholder=\u0022Password\u0022 value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className=\u0022text-red-500 text-sm\u0022>{error}</p>}
        <Button className=\u0022w-full bg-indigo-600 hover:bg-indigo-700\u0022 type=\u0022submit\u0022>Sign Up</Button>
      </form>
      <p className=\u0022text-center mt-6 text-slate-600 text-sm\u0022>Already have an account? <Link to=\u0022/login\u0022 className=\u0022text-indigo-600 font-medium\u0022>Login</Link></p>
    </div>
  );
}"

app = "import { Routes, Route, Navigate } from react-router-dom;
import { useAuth } from ./contexts/AuthContext;
import { Navbar } from ./components/Navbar;
import Dashboard from ./pages/Dashboard;
import LandingPage from ./pages/LandingPage;
import Login from ./pages/Login;
import Signup from ./pages/Signup;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to=/login />;\n  return <>{children}</>;
}

export default function App() {
  return (
    <div className=min-h-screen bg-slate-50 flex flex-col>
      <Navbar />
      <div className=flex-1>
        <Routes>
          <Route path=/ element={<LandingPage />} />
          <Route path=/login element={<Login />} />
          <Route path=/signup element={<Signup />} />
          <Route path=/app element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}"

w(frontend/src/pages/LandingPage.tsx, landing)
w(frontend/src/pages/Login.tsx, login)
w(frontend/src/pages/Signup.tsx, signup)
w(frontend/src/App.tsx, app)

