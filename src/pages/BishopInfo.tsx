import React, { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BishopInfo as BishopInfoType } from '../types';

const BishopInfo: React.FC = () => {
  const [bishopInfo, setBishopInfo] = useState<BishopInfoType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBishopInfo();
  }, []);

  const fetchBishopInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('bishop_info')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setBishopInfo(data);
    } catch (error) {
      console.error('Error fetching bishop info:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!bishopInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sobre o Bispo</h1>
            <p className="text-gray-600">Informações sobre o bispo serão adicionadas em breve.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 px-8 py-12">
            <h1 className="text-4xl font-bold text-white text-center">
              Sobre o Bispo
            </h1>
          </div>
          
          <div className="px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {bishopInfo.photo && (
                <div className="flex-shrink-0">
                  <img
                    src={bishopInfo.photo}
                    alt={bishopInfo.name}
                    className="w-64 h-80 object-cover rounded-lg shadow-md mx-auto md:mx-0"
                  />
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {bishopInfo.name}
                </h2>
                
                <div className="space-y-3 mb-6">
                  {bishopInfo.ordination_date && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      <span>
                        <strong>Ordenação Sacerdotal:</strong> {formatDate(bishopInfo.ordination_date)}
                      </span>
                    </div>
                  )}
                  
                  {bishopInfo.appointment_date && (
                    <div className="flex items-center text-gray-600">
                      <User className="h-5 w-5 mr-3 text-blue-600" />
                      <span>
                        <strong>Nomeação Episcopal:</strong> {formatDate(bishopInfo.appointment_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Biografia</h3>
              <div dangerouslySetInnerHTML={{ __html: bishopInfo.bio }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BishopInfo;