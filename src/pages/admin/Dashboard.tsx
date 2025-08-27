import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Church, 
  MessageSquare, 
  Settings,
  BarChart3,
  Calendar,
  Bell
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  articles: number;
  parishes: number;
  priests: number;
  deacons: number;
  seminarians: number;
  categories: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    articles: 0,
    parishes: 0,
    priests: 0,
    deacons: 0,
    seminarians: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        articlesResult,
        parishesResult,
        priestsResult,
        deaconsResult,
        seminariansResult,
        categoriesResult,
      ] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('parishes').select('id', { count: 'exact', head: true }),
        supabase.from('priests').select('id', { count: 'exact', head: true }),
        supabase.from('deacons').select('id', { count: 'exact', head: true }),
        supabase.from('seminarians').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        articles: articlesResult.count || 0,
        parishes: parishesResult.count || 0,
        priests: priestsResult.count || 0,
        deacons: deaconsResult.count || 0,
        seminarians: seminariansResult.count || 0,
        categories: categoriesResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Artigos',
      value: stats.articles,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/articles'
    },
    {
      title: 'Paróquias',
      value: stats.parishes,
      icon: Church,
      color: 'bg-green-500',
      href: '/admin/parishes'
    },
    {
      title: 'Padres',
      value: stats.priests,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/priests'
    },
    {
      title: 'Diáconos',
      value: stats.deacons,
      icon: Users,
      color: 'bg-yellow-500',
      href: '/admin/deacons'
    },
    {
      title: 'Seminaristas',
      value: stats.seminarians,
      icon: Users,
      color: 'bg-red-500',
      href: '/admin/seminarians'
    },
    {
      title: 'Categorias',
      value: stats.categories,
      icon: BarChart3,
      color: 'bg-indigo-500',
      href: '/admin/categories'
    },
  ];

  const quickActions = [
    {
      title: 'Novo Artigo',
      description: 'Criar uma nova notícia ou artigo',
      icon: FileText,
      href: '/admin/articles/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Mensagem do Bispo',
      description: 'Adicionar nova mensagem episcopal',
      icon: MessageSquare,
      href: '/admin/bishop-messages/new',
      color: 'bg-green-500'
    },
    {
      title: 'Aviso Pop-up',
      description: 'Criar novo aviso em pop-up',
      icon: Bell,
      href: '/admin/popup-announcements/new',
      color: 'bg-yellow-500'
    },
    {
      title: 'Configurações',
      description: 'Gerenciar configurações do site',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo da Diocese de São Miguel Paulista</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`${action.color} text-white p-3 rounded-lg w-fit mb-4`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Sistema inicializado</p>
              <p className="text-xs text-gray-500">Painel administrativo pronto para uso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;