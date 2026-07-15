import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Terms from './pages/Terms';
import Features from './pages/Features';
import Profile from './pages/Profile';
import ToolRunner from './pages/ToolRunner';
import { Footer } from './components/Footer';
import { ThreeBackground } from './components/ThreeBackground';
import { SaaSLayout } from './components/SaaSLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');

  if (isAppRoute) {
    return (
      <Routes>
        <Route path="/app" element={<ProtectedRoute><SaaSLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="tools/seo-audit-tool" element={<Dashboard />} />
          <Route path="tools/:toolId" element={<ToolRunner />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="min-h-screen text-on-surface flex flex-col relative selection:bg-electric-indigo/30">
      <ThreeBackground />
      <Navbar />
      <div className="flex-1 mt-16 relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/features" element={<Features />} />
        </Routes>
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
