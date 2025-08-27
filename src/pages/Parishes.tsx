import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Clock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Parish } from '../types';

const Parishes: React.FC = () => {
  const [parishes, setParishes] = useState<Parish[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchParishes();
  }, []);

  const fetchParishes = async () => {
    try {
      const { data, error } = await supabase
        .from('parishes')
        .select(`
          *,
          priest:priests(name, slug)
        `)
        .order('name');

      if (error) throw error;
      setParishes(data || []);
    } catch (error) {
      console.error('Error fetching parishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParishes = parishes.filter(parish =>
    parish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parish.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Paróquias</h1>
          <p className="text-xl text-gray-600">Conheça as comunidades de fé da nossa diocese</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar paróquia por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Parishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredParishes.map((parish) => (
            <Link
              key={parish.id}
              to={`/paroquias/${parish.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {parish.photo && (
                <img
                  src={parish.photo}
                  alt={parish.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {parish.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
                    <span>{parish.address}</span>
                  </div>
                  
                  {parish.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{parish.phone}</span>
                    </div>
                  )}
                  
                  {parish.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{parish.email}</span>
                    </div>
                  )}
                  
                  {parish.priest && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Pe. {parish.priest.name}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Horários de Missa:</p>
                      <p className="text-sm text-gray-600">{parish.mass_schedule}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredParishes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma paróquia encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parishes;