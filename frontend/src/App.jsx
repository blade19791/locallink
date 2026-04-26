import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ProviderDetails from './pages/ProviderDetails';
import ProviderRegistration from './pages/ProviderRegistration';
import Register from './pages/Register';
import Login from './pages/Login';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ClientBookings from './pages/ClientBookings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/providers/:id" element={<ProviderDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-provider" element={<ProviderRegistration />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-bookings" element={<ClientBookings />} />
          </Routes>

        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
