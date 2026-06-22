import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Appels from './pages/Appels.jsx';
import AppelDetail from './pages/AppelDetail.jsx';
import Configuration from './pages/Configuration.jsx';
import Demo from './pages/Demo.jsx';
import Layout from './components/Layout.jsx';

export const AuthContext = createContext(null);

export function useAuth() { return useContext(AuthContext); }

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ai_user')); } catch { return null; }
  });

  const login = (userData, token) => {
    localStorage.setItem('ai_token', token);
    localStorage.setItem('ai_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ai_token');
    localStorage.removeItem('ai_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/app" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="appels" element={<Appels />} />
            <Route path="appels/:id" element={<AppelDetail />} />
            <Route path="configuration" element={<Configuration />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
