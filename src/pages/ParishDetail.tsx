import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, User, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Parish } from '../types';

const ParishDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [parish, setParish] = useState<Parish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchParish();
    }
  }, [slug]);

  const fetchParish = async () => {
    try {
      const { data, error } = await supabase
        .from('parishes')
        .select(`
          *,
          priest:priests(name, slug, photo, phone, email)
        `)
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();

      if (error) throw error;
      setParish(data);
    } catch (error) {
      console.error('Error fetching parish:', error);
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
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!parish) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paróquia não encontrada</h1>
          <Link to="/paroquias" className="text-blue-600 hover:text-blue-800">
            ← Voltar para paróquias
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/paroquias"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para paróquias
        </Link>

        {/* Parish Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {parish.photo && (
            <img
              src={parish.photo}
              alt={parish.name}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {parish.name}
            </h1>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Informações de Contato</h2>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Endereço</p>
                    <p className="text-gray-600">{parish.address}</p>
                  </div>
                </div>
                
                {parish.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Telefone</p>
                      <p className="text-gray-600">{parish.phone}</p>
                    </div>
                  </div>
                )}
                
                {parish.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">E-mail</p>
                      <p className="text-gray-600">{parish.email}</p>
                    </div>
                  </div>
                )}
                
                {parish.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a 
                        href={parish.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {parish.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Horários de Missa</h2>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                  <div>
                    <div 
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: parish.mass_schedule.replace(/\n/g, '<br>') }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Priest Info */}
            {parish.priest && (
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pároco</h2>
                <div className="flex items-start space-x-4">
                  {parish.priest.photo && (
                    <img
                      src={parish.priest.photo}
                      alt={parish.priest.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Pe. {parish.priest.name}
                    </h3>
                    {parish.priest.phone && (
                      <p className="text-gray-600">Telefone: {parish.priest.phone}</p>
                    )}
                    {parish.priest.email && (
                      <p className="text-gray-600">E-mail: {parish.priest.email}</p>
                    )}
                    <Link
                      to={`/padres/${parish.priest.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver perfil completo →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {parish.description && (
              <div className="border-t pt-8 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre a Paróquia</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: parish.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParishDetail;