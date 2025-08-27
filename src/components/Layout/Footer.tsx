import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SiteSettings } from '../../types';

const Footer: React.FC = () => {
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
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-red-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Diocese Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {siteSettings?.site_title || 'Diocese de São Miguel Paulista'}
            </h3>
            <p className="text-gray-200 mb-4">
              {siteSettings?.site_description || 'Uma diocese comprometida com a evangelização e o serviço ao povo de Deus.'}
            </p>
            <div className="flex space-x-4">
              {siteSettings?.social_links?.facebook && (
                <a href={siteSettings.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-yellow-300 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {siteSettings?.social_links?.instagram && (
                <a href={siteSettings.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-yellow-300 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {siteSettings?.social_links?.youtube && (
                <a href={siteSettings.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-yellow-300 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {siteSettings?.social_links?.twitter && (
                <a href={siteSettings.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-200 hover:text-yellow-300 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/sobre" className="text-gray-200 hover:text-yellow-300 transition-colors">Sobre a Diocese</a></li>
              <li><a href="/bispo" className="text-gray-200 hover:text-yellow-300 transition-colors">Sobre o Bispo</a></li>
              <li><a href="/paroquias" className="text-gray-200 hover:text-yellow-300 transition-colors">Paróquias</a></li>
              <li><a href="/noticias" className="text-gray-200 hover:text-yellow-300 transition-colors">Notícias</a></li>
              <li><a href="/contato" className="text-gray-200 hover:text-yellow-300 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            {siteSettings?.contact_info && (
              <div className="space-y-3">
                {(siteSettings.contact_info as any).address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-yellow-300" />
                    <span className="text-gray-200">{(siteSettings.contact_info as any).address}</span>
                  </div>
                )}
                {(siteSettings.contact_info as any).phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-yellow-300" />
                    <span className="text-gray-200">{(siteSettings.contact_info as any).phone}</span>
                  </div>
                )}
                {(siteSettings.contact_info as any).email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-yellow-300" />
                    <span className="text-gray-200">{(siteSettings.contact_info as any).email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-gray-200">
            © {new Date().getFullYear()} {siteSettings?.site_title || 'Diocese de São Miguel Paulista'}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;