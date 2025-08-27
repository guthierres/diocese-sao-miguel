import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

const About: React.FC = () => {
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
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
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
              Sobre a Diocese de São Miguel Paulista
            </h1>
          </div>
          
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              {siteSettings?.about_diocese ? (
                <div dangerouslySetInnerHTML={{ __html: siteSettings.about_diocese }} />
              ) : (
                <div>
                  <h2>História da Diocese</h2>
                  <p>
                    A Diocese de São Miguel Paulista foi criada em 15 de agosto de 1981, pelo Papa João Paulo II, 
                    através da Bula "Cum Ecclesiae". Desmembrada da Arquidiocese de São Paulo, a nova circunscrição 
                    eclesiástica foi confiada aos cuidados pastorais de Dom Angélico Sândalo Bernardino, 
                    seu primeiro bispo diocesano.
                  </p>
                  
                  <h2>Território e População</h2>
                  <p>
                    A Diocese abrange uma área de 1.044 km² na região leste da Grande São Paulo, 
                    atendendo a uma população de aproximadamente 1,8 milhão de habitantes. 
                    Compreende os municípios de Arujá, Biritiba-Mirim, Ferraz de Vasconcelos, 
                    Guararema, Guarulhos, Itaquaquecetuba, Mogi das Cruzes, Poá, Salesópolis, 
                    Santa Isabel e Suzano.
                  </p>
                  
                  <h2>Missão</h2>
                  <p>
                    Nossa missão é evangelizar, promover a dignidade humana e construir uma sociedade 
                    mais justa e fraterna, seguindo os ensinamentos de Jesus Cristo. Trabalhamos 
                    incansavelmente para levar a Palavra de Deus a todos os cantos de nossa diocese, 
                    especialmente aos mais necessitados.
                  </p>
                  
                  <h2>Estrutura Pastoral</h2>
                  <p>
                    A Diocese conta com mais de 80 paróquias, centenas de comunidades, 
                    movimentos e pastorais que atuam em diversas frentes: liturgia, catequese, 
                    juventude, família, social, comunicação, entre outras. Nosso clero é composto 
                    por padres diocesanos e religiosos, diáconos permanentes e seminaristas em formação.
                  </p>
                  
                  <h2>Compromisso Social</h2>
                  <p>
                    Além da dimensão espiritual, a Diocese mantém um forte compromisso social, 
                    desenvolvendo projetos de assistência aos mais pobres, educação, saúde e 
                    promoção humana. Acreditamos que a fé deve se traduzir em ações concretas 
                    de amor ao próximo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;