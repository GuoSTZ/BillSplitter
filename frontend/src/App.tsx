import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import PeopleManagement from './pages/PeopleManagement';
import BillManagement from './pages/BillManagement'; // 添加这行
import MainLayout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter basename='/g-bill'>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/app" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="people" element={<PeopleManagement />} />
            <Route path="bills" element={<BillManagement />} /> {/* 添加这行 */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
