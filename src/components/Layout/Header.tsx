import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SiteSettings } from '../../types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      setSiteSettings(data);
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-red-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {siteSettings?.logo_url ? (
              <img 
                src={siteSettings.logo_url} 
                alt={siteSettings.site_title} 
                className="h-16 w-auto max-w-[300px]"
              />
            ) : (
              <div className="h-16 w-64 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm text-center px-2">
                  {siteSettings?.site_title || 'DIOCESE SMP'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-yellow-300 transition-colors font-medium">
              Início
            </Link>
            <div className="relative group">
              <button className="text-white hover:text-yellow-300 transition-colors font-medium flex items-center">
                Diocese <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/sobre" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Sobre a Diocese</Link>
                <Link to="/bispo" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Sobre o Bispo</Link>
                <Link to="/mensagens-bispo" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Mensagens do Bispo</Link>
              </div>
            </div>
            <div className="relative group">
              <button className="text-white hover:text-yellow-300 transition-colors font-medium flex items-center">
                Clero <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/padres" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Padres</Link>
                <Link to="/diaconos" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Diáconos</Link>
                <Link to="/seminaristas" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Seminaristas</Link>
              </div>
            </div>
            <Link to="/paroquias" className="text-white hover:text-yellow-300 transition-colors font-medium">
              Paróquias
            </Link>
            <Link to="/noticias" className="text-white hover:text-yellow-300 transition-colors font-medium">
              Notícias
            </Link>
            <Link to="/contato" className="text-white hover:text-yellow-300 transition-colors font-medium">
              Contato
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-yellow-300"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-yellow-300 transition-colors">
                Início
              </Link>
              <Link to="/sobre" className="text-white hover:text-yellow-300 transition-colors">
                Sobre a Diocese
              </Link>
              <Link to="/bispo" className="text-white hover:text-yellow-300 transition-colors">
                Sobre o Bispo
              </Link>
              <Link to="/mensagens-bispo" className="text-white hover:text-yellow-300 transition-colors">
                Mensagens do Bispo
              </Link>
              <Link to="/padres" className="text-white hover:text-yellow-300 transition-colors">
                Padres
              </Link>
              <Link to="/diaconos" className="text-white hover:text-yellow-300 transition-colors">
                Diáconos
              </Link>
              <Link to="/seminaristas" className="text-white hover:text-yellow-300 transition-colors">
                Seminaristas
              </Link>
              <Link to="/paroquias" className="text-white hover:text-yellow-300 transition-colors">
                Paróquias
              </Link>
              <Link to="/noticias" className="text-white hover:text-yellow-300 transition-colors">
                Notícias
              </Link>
              <Link to="/contato" className="text-white hover:text-yellow-300 transition-colors">
                Contato
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;