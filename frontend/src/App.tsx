import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ToolRunner from './pages/ToolRunner';
import { SaaSLayout } from './components/SaaSLayout';

export default function App() {
  return (
    <Routes>
      {/* Root workspace routes */}
      <Route path="/" element={<SaaSLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="tools/seo-audit-tool" element={<Dashboard />} />
        <Route path="tools/:toolId" element={<ToolRunner />} />
      </Route>

      {/* Legacy /app prefix routes mapping directly to dashboard */}
      <Route path="/app" element={<SaaSLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="tools/seo-audit-tool" element={<Dashboard />} />
        <Route path="tools/:toolId" element={<ToolRunner />} />
      </Route>

      {/* Catch-all redirects directly to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
