import React, { useState, useEffect } from 'react';
import { Calendar, Users, Church, BookOpen, ArrowRight } from 'lucide-react';
import NewsSlider from '../components/Slider/NewsSlider';
import PopupAnnouncement from '../components/PopupAnnouncement/PopupAnnouncement';
import { supabase } from '../lib/supabase';
import { Article, BishopMessage, SiteSettings } from '../types';

const Home: React.FC = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [recentMessage, setRecentMessage] = useState<BishopMessage | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [homeSections, setHomeSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch recent articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (articlesError) throw articlesError;
      setRecentArticles(articlesData || []);

      // Fetch recent bishop message
      const { data: messageData, error: messageError } = await supabase
        .from('bishop_messages')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (messageError && messageError.code !== 'PGRST116') throw messageError;
      setRecentMessage(messageData);

      // Fetch site settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      setSiteSettings(settingsData);

      // Fetch home sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('home_sections')
        .select('*')
        .eq('active', true)
        .order('order_index');

      if (sectionsError) throw sectionsError;
      setHomeSections(sectionsData || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Church,
      Users,
      BookOpen,
      Calendar
    };
    return icons[iconName] || Church;
  };

  return (
    <div className="min-h-screen">
      <PopupAnnouncement />
      
      {/* Hero Section with Slider */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsSlider />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {siteSettings?.site_title || 'Bem-vindos à Diocese de São Miguel Paulista'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {siteSettings?.site_description || 'Uma comunidade de fé comprometida com a evangelização, a caridade e o serviço ao povo de Deus na região leste de São Paulo.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {homeSections.map((section, index) => {
              const IconComponent = getIconComponent(section.icon);
              const colors = ['bg-blue-600', 'bg-red-600', 'bg-yellow-600', 'bg-green-600'];
              const colorClass = colors[index % colors.length];
              
              return (
                <a
                  key={section.id}
                  href={section.link_url}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-200"
                >
                  <div className={`${colorClass} text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{section.description}</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 mx-auto text-blue-600" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bishop Message Section */}
      {recentMessage && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Mensagem do Bispo</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-lg p-8">
                {recentMessage.featured_image && (
                  <img
                    src={recentMessage.featured_image}
                    alt={recentMessage.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {recentMessage.title}
                </h3>
                <div
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: recentMessage.content.substring(0, 300) + '...' }}
                />
                <a
                  href={`/mensagens-bispo/${recentMessage.id}`}
                  className="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Ler mensagem completa
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Últimas Notícias</h2>
            <p className="text-xl text-gray-600">Fique por dentro das novidades da nossa diocese</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {article.featured_image && (
                    <img
                      src={article.featured_image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    {article.category && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <a
                      href={`/noticias/${article.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Ler mais →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/noticias"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Ver todas as notícias
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;