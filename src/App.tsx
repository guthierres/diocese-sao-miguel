import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Parishes from './pages/Parishes';
import ParishDetail from './pages/ParishDetail';
import Clergy from './pages/Clergy';
import BishopMessages from './pages/BishopMessages';
import BishopInfo from './pages/BishopInfo';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import ArticlesAdmin from './pages/admin/ArticlesAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Helmet>
            <title>Diocese de São Miguel Paulista</title>
            <meta name="description" content="Diocese de São Miguel Paulista - Evangelização, caridade e serviço ao povo de Deus na região leste de São Paulo." />
            <meta name="keywords" content="diocese são miguel paulista, igreja católica, paróquias, padres, evangelização, são paulo" />
            <meta property="og:title" content="Diocese de São Miguel Paulista" />
            <meta property="og:description" content="Diocese de São Miguel Paulista - Evangelização, caridade e serviço ao povo de Deus na região leste de São Paulo." />
            <meta property="og:type" content="website" />
            <link rel="canonical" href="https://diocesesmp.org.br" />
          </Helmet>
          
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/articles/*" element={<ArticlesAdmin />} />
                    <Route path="/categories/*" element={<CategoriesAdmin />} />
                    <Route path="/settings" element={
                      <ProtectedRoute requiredRole="admin">
                        <SettingsAdmin />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre" element={<About />} />
                    <Route path="/noticias" element={<News />} />
                    <Route path="/noticias/:slug" element={<NewsDetail />} />
                    <Route path="/paroquias" element={<Parishes />} />
                    <Route path="/paroquias/:slug" element={<ParishDetail />} />
                    <Route path="/clero" element={<Clergy />} />
                    <Route path="/padres/:slug" element={<Clergy />} />
                    <Route path="/diaconos/:slug" element={<Clergy />} />
                    <Route path="/seminaristas/:slug" element={<Clergy />} />
                    <Route path="/mensagens-bispo" element={<BishopMessages />} />
                    <Route path="/mensagens-bispo/:slug" element={<BishopMessages />} />
                    <Route path="/bispo" element={<BishopInfo />} />
                    <Route path="/contato" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
