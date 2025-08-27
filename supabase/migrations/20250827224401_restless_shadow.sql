/*
  # Schema completo da Diocese de São Miguel Paulista

  1. Tabelas principais
    - `users` - Usuários administrativos
    - `categories` - Categorias de artigos
    - `articles` - Artigos/notícias
    - `bishop_messages` - Mensagens do bispo
    - `bishop_info` - Informações do bispo
    - `priests` - Cadastro de padres
    - `deacons` - Cadastro de diáconos
    - `seminarians` - Cadastro de seminaristas
    - `parishes` - Cadastro de paróquias
    - `popup_announcements` - Avisos em pop-up
    - `site_settings` - Configurações do site
    - `home_sections` - Seções editáveis da página inicial

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para leitura pública e escrita administrativa
*/

-- Criar extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Categories are editable by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de artigos
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  category_id uuid REFERENCES categories(id),
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES users(id),
  published boolean DEFAULT false,
  show_in_slider boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are viewable by everyone when published"
  ON articles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Articles are editable by authenticated users"
  ON articles
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de mensagens do bispo
CREATE TABLE IF NOT EXISTS bishop_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  featured_image text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bishop_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bishop messages are viewable by everyone when published"
  ON bishop_messages
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Bishop messages are editable by authenticated users"
  ON bishop_messages
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de informações do bispo
CREATE TABLE IF NOT EXISTS bishop_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL,
  photo text,
  ordination_date date,
  appointment_date date,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bishop_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bishop info is viewable by everyone"
  ON bishop_info
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Bishop info is editable by authenticated users"
  ON bishop_info
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de padres
CREATE TABLE IF NOT EXISTS priests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  photo text,
  ordination_date date,
  current_parish_id uuid,
  phone text,
  email text,
  bio text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'retired', 'transferred')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE priests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Priests are viewable by everyone"
  ON priests
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Priests are editable by authenticated users"
  ON priests
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de diáconos
CREATE TABLE IF NOT EXISTS deacons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  photo text,
  ordination_date date,
  parish_id uuid,
  phone text,
  email text,
  bio text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deacons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deacons are viewable by everyone"
  ON deacons
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Deacons are editable by authenticated users"
  ON deacons
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de seminaristas
CREATE TABLE IF NOT EXISTS seminarians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  photo text,
  seminary text NOT NULL,
  year_of_study integer NOT NULL,
  phone text,
  email text,
  bio text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seminarians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seminarians are viewable by everyone"
  ON seminarians
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Seminarians are editable by authenticated users"
  ON seminarians
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de paróquias
CREATE TABLE IF NOT EXISTS parishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  website text,
  priest_id uuid REFERENCES priests(id),
  mass_schedule text NOT NULL,
  photo text,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parishes are viewable by everyone"
  ON parishes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Parishes are editable by authenticated users"
  ON parishes
  FOR ALL
  TO authenticated
  USING (true);

-- Adicionar referência de paróquia atual para padres
ALTER TABLE priests ADD CONSTRAINT fk_priests_parish 
  FOREIGN KEY (current_parish_id) REFERENCES parishes(id);

ALTER TABLE deacons ADD CONSTRAINT fk_deacons_parish 
  FOREIGN KEY (parish_id) REFERENCES parishes(id);

-- Tabela de avisos pop-up
CREATE TABLE IF NOT EXISTS popup_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image text,
  active boolean DEFAULT false,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE popup_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popup announcements are viewable by everyone when active"
  ON popup_announcements
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Popup announcements are editable by authenticated users"
  ON popup_announcements
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  site_title text NOT NULL DEFAULT 'Diocese de São Miguel Paulista',
  site_description text NOT NULL DEFAULT 'Uma diocese comprometida com a evangelização e o serviço ao povo de Deus.',
  about_diocese text NOT NULL DEFAULT '<p>A Diocese de São Miguel Paulista foi criada em 15 de agosto de 1981...</p>',
  contact_info jsonb DEFAULT '{"address": "Rua Voluntários da Pátria, 1264 - Santana, São Paulo - SP", "phone": "(11) 2221-3344", "email": "contato@diocesesmp.org.br"}',
  social_links jsonb DEFAULT '{}',
  seo_keywords text DEFAULT 'diocese, são miguel paulista, igreja católica, paróquias',
  seo_description text DEFAULT 'Diocese de São Miguel Paulista - Evangelização, caridade e serviço ao povo de Deus na região leste de São Paulo.',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Site settings are editable by authenticated users"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de seções da página inicial
CREATE TABLE IF NOT EXISTS home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  link_url text,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Home sections are viewable by everyone when active"
  ON home_sections
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Home sections are editable by authenticated users"
  ON home_sections
  FOR ALL
  TO authenticated
  USING (true);

-- Inserir configurações padrão
INSERT INTO site_settings (
  site_title,
  site_description,
  about_diocese,
  contact_info,
  seo_keywords,
  seo_description
) VALUES (
  'Diocese de São Miguel Paulista',
  'Uma diocese comprometida com a evangelização e o serviço ao povo de Deus na região leste de São Paulo.',
  '<h2>História da Diocese</h2><p>A Diocese de São Miguel Paulista foi criada em 15 de agosto de 1981, pelo Papa João Paulo II, através da Bula "Cum Ecclesiae". Desmembrada da Arquidiocese de São Paulo, a nova circunscrição eclesiástica foi confiada aos cuidados pastorais de Dom Angélico Sândalo Bernardino, seu primeiro bispo diocesano.</p><h2>Território e População</h2><p>A Diocese abrange uma área de 1.044 km² na região leste da Grande São Paulo, atendendo a uma população de aproximadamente 1,8 milhão de habitantes. Compreende os municípios de Arujá, Biritiba-Mirim, Ferraz de Vasconcelos, Guararema, Guarulhos, Itaquaquecetuba, Mogi das Cruzes, Poá, Salesópolis, Santa Isabel e Suzano.</p><h2>Missão</h2><p>Nossa missão é evangelizar, promover a dignidade humana e construir uma sociedade mais justa e fraterna, seguindo os ensinamentos de Jesus Cristo. Trabalhamos incansavelmente para levar a Palavra de Deus a todos os cantos de nossa diocese, especialmente aos mais necessitados.</p>',
  '{"address": "Rua Voluntários da Pátria, 1264 - Santana, São Paulo - SP", "phone": "(11) 2221-3344", "email": "contato@diocesesmp.org.br"}',
  'diocese são miguel paulista, igreja católica, paróquias, padres, evangelização, são paulo',
  'Diocese de São Miguel Paulista - Evangelização, caridade e serviço ao povo de Deus na região leste de São Paulo. Paróquias, padres, diáconos e seminaristas.'
) ON CONFLICT (id) DO NOTHING;

-- Inserir seções padrão da página inicial
INSERT INTO home_sections (section_key, title, description, icon, link_url, order_index) VALUES
  ('parishes', 'Paróquias', 'Comunidades de fé espalhadas pela região', 'Church', '/paroquias', 1),
  ('clergy', 'Clero', 'Padres, diáconos e seminaristas dedicados', 'Users', '/clero', 2),
  ('formation', 'Formação', 'Educação cristã e crescimento espiritual', 'BookOpen', '/formacao', 3),
  ('events', 'Eventos', 'Celebrações e atividades comunitárias', 'Calendar', '/eventos', 4)
ON CONFLICT (section_key) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description) VALUES
  ('Notícias', 'noticias', 'Notícias gerais da diocese'),
  ('Eventos', 'eventos', 'Eventos e celebrações'),
  ('Formação', 'formacao', 'Conteúdo de formação cristã'),
  ('Pastoral', 'pastoral', 'Atividades pastorais'),
  ('Social', 'social', 'Ação social e caridade')
ON CONFLICT (slug) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slider ON articles(show_in_slider);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parishes_priest ON parishes(priest_id);
CREATE INDEX IF NOT EXISTS idx_priests_parish ON priests(current_parish_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_home_sections_updated_at BEFORE UPDATE ON home_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bishop_info_updated_at BEFORE UPDATE ON bishop_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();