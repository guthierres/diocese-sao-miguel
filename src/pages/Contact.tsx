import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

const Contact: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contactInfo = siteSettings?.contact_info as any || {};
  const socialLinks = siteSettings?.social_links as any || {};

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white text-center">
              Entre em Contato
            </h1>
            <p className="text-xl text-blue-100 text-center mt-4">
              Estamos aqui para atendê-lo
            </p>
          </div>
          
          <div className="px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações de Contato</h2>
                
                <div className="space-y-4">
                  {contactInfo.address && (
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Endereço</h3>
                        <p className="text-gray-600">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.phone && (
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Telefone</h3>
                        <p className="text-gray-600">{contactInfo.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {contactInfo.email && (
                    <div className="flex items-start">
                      <Mail className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">E-mail</h3>
                        <p className="text-gray-600">{contactInfo.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 mr-4 mt-1 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Horário de Atendimento</h3>
                      <p className="text-gray-600">
                        Segunda a Sexta: 8h às 17h<br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociais</h3>
                  <div className="flex space-x-4">
                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie uma Mensagem</h2>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;