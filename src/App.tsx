import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PublicHome from './pages/PublicHome';

function App() {
  return (
    <Router>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </AdminProvider>
    </Router>
  );
}

export default App;
