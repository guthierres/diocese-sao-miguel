import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Priest, Deacon, Seminarian } from '../types';

const Clergy: React.FC = () => {
  const [priests, setPriests] = useState<Priest[]>([]);
  const [deacons, setDeacons] = useState<Deacon[]>([]);
  const [seminarians, setSeminarians] = useState<Seminarian[]>([]);
  const [activeTab, setActiveTab] = useState<'priests' | 'deacons' | 'seminarians'>('priests');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClergy();
  }, []);

  const fetchClergy = async () => {
    try {
      const [priestsResult, deaconsResult, seminariansResult] = await Promise.all([
        supabase
          .from('priests')
          .select(`
            *,
            parish:parishes(name, slug)
          `)
          .eq('status', 'active')
          .order('name'),
        
        supabase
          .from('deacons')
          .select(`
            *,
            parish:parishes(name, slug)
          `)
          .eq('status', 'active')
          .order('name'),
        
        supabase
          .from('seminarians')
          .select('*')
          .order('name')
      ]);

      if (priestsResult.error) throw priestsResult.error;
      if (deaconsResult.error) throw deaconsResult.error;
      if (seminariansResult.error) throw seminariansResult.error;

      setPriests(priestsResult.data || []);
      setDeacons(deaconsResult.data || []);
      setSeminarians(seminariansResult.data || []);
    } catch (error) {
      console.error('Error fetching clergy:', error);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Clero</h1>
          <p className="text-xl text-gray-600">Conheça os membros do clero da nossa diocese</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('priests')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'priests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Padres ({priests.length})
            </button>
            <button
              onClick={() => setActiveTab('deacons')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'deacons'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Diáconos ({deacons.length})
            </button>
            <button
              onClick={() => setActiveTab('seminarians')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'seminarians'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Seminaristas ({seminarians.length})
            </button>
          </div>
        </div>

        {/* Priests */}
        {activeTab === 'priests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {priests.map((priest) => (
              <Link
                key={priest.id}
                to={`/padres/${priest.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {priest.photo ? (
                      <img
                        src={priest.photo}
                        alt={priest.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pe. {priest.name}
                      </h3>
                      {priest.parish && (
                        <p className="text-sm text-gray-600">
                          Pároco - {priest.parish.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {priest.ordination_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Ordenado em {formatDate(priest.ordination_date)}</span>
                      </div>
                    )}
                    
                    {priest.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{priest.phone}</span>
                      </div>
                    )}
                    
                    {priest.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{priest.email}</span>
                      </div>
                    )}
                  </div>

                  {priest.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {priest.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Deacons */}
        {activeTab === 'deacons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deacons.map((deacon) => (
              <Link
                key={deacon.id}
                to={`/diaconos/${deacon.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {deacon.photo ? (
                      <img
                        src={deacon.photo}
                        alt={deacon.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Diác. {deacon.name}
                      </h3>
                      {deacon.parish && (
                        <p className="text-sm text-gray-600">
                          {deacon.parish.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {deacon.ordination_date && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        <span>Ordenado em {formatDate(deacon.ordination_date)}</span>
                      </div>
                    )}
                    
                    {deacon.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <span>{deacon.phone}</span>
                      </div>
                    )}
                    
                    {deacon.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-green-600" />
                        <span>{deacon.email}</span>
                      </div>
                    )}
                  </div>

                  {deacon.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {deacon.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Seminarians */}
        {activeTab === 'seminarians' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {seminarians.map((seminarian) => (
              <Link
                key={seminarian.id}
                to={`/seminaristas/${seminarian.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    {seminarian.photo ? (
                      <img
                        src={seminarian.photo}
                        alt={seminarian.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-yellow-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {seminarian.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {seminarian.year_of_study}º ano - {seminarian.seminary}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {seminarian.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-yellow-600" />
                        <span>{seminarian.phone}</span>
                      </div>
                    )}
                    
                    {seminarian.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-yellow-600" />
                        <span>{seminarian.email}</span>
                      </div>
                    )}
                  </div>

                  {seminarian.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {seminarian.bio}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'priests' && priests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum padre cadastrado.</p>
          </div>
        )}
        
        {activeTab === 'deacons' && deacons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum diácono cadastrado.</p>
          </div>
        )}
        
        {activeTab === 'seminarians' && seminarians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum seminarista cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clergy;