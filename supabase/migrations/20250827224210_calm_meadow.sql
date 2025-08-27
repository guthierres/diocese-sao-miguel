/*
  # Schema Completo da Diocese de São Miguel Paulista

  1. Tabelas Principais
    - `users` - Usuários administrativos
    - `categories` - Categorias de artigos
    - `articles` - Artigos/notícias
    - `bishop_info` - Informações do bispo
    - `bishop_messages` - Mensagens do bispo
    - `priests` - Cadastro de padres
    - `deacons` - Cadastro de diáconos
    - `seminarians` - Cadastro de seminaristas
    - `parishes` - Cadastro de paróquias
    - `popup_announcements` - Avisos em pop-up
    - `site_settings` - Configurações do site
    - `navigation_items` - Itens de navegação editáveis

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para leitura pública e escrita administrativa
*/

-- Criar extensões necessárias
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
  USING (auth.uid() = id);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are editable by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de artigos/notícias
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  featured_image text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  published boolean DEFAULT false,
  show_in_slider boolean DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are viewable by everyone"
  ON articles
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Articles are editable by authenticated users"
  ON articles
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
  meta_title text,
  meta_description text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bishop_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bishop info is viewable by everyone"
  ON bishop_info
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Bishop info is editable by authenticated users"
  ON bishop_info
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
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bishop_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bishop messages are viewable by everyone"
  ON bishop_messages
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Bishop messages are editable by authenticated users"
  ON bishop_messages
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
  bio text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'retired', 'transferred')),
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE priests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Priests are viewable by everyone"
  ON priests
  FOR SELECT
  TO public
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
  bio text DEFAULT '',
  status text DEFAULT 'active' CHECK (status IN ('active', 'retired')),
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deacons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deacons are viewable by everyone"
  ON deacons
  FOR SELECT
  TO public
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
  year_of_study integer DEFAULT 1,
  phone text,
  email text,
  bio text DEFAULT '',
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE seminarians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seminarians are viewable by everyone"
  ON seminarians
  FOR SELECT
  TO public
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
  priest_id uuid REFERENCES priests(id) ON DELETE SET NULL,
  mass_schedule text NOT NULL,
  photo text,
  description text DEFAULT '',
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parishes are viewable by everyone"
  ON parishes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Parishes are editable by authenticated users"
  ON parishes
  FOR ALL
  TO authenticated
  USING (true);

-- Adicionar referência de paróquia atual para padres
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'priests_current_parish_id_fkey'
  ) THEN
    ALTER TABLE priests ADD CONSTRAINT priests_current_parish_id_fkey 
    FOREIGN KEY (current_parish_id) REFERENCES parishes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Adicionar referência de paróquia para diáconos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'deacons_parish_id_fkey'
  ) THEN
    ALTER TABLE deacons ADD CONSTRAINT deacons_parish_id_fkey 
    FOREIGN KEY (parish_id) REFERENCES parishes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Tabela de avisos pop-up
CREATE TABLE IF NOT EXISTS popup_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image text,
  active boolean DEFAULT false,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE popup_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Popup announcements are viewable by everyone"
  ON popup_announcements
  FOR SELECT
  TO public
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
  site_title text DEFAULT 'Diocese de São Miguel Paulista',
  site_description text DEFAULT 'Diocese de São Miguel Paulista - Evangelização e Serviço',
  about_diocese text DEFAULT '',
  contact_info text DEFAULT '',
  social_links jsonb DEFAULT '{}',
  meta_title text,
  meta_description text,
  meta_keywords text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Site settings are editable by authenticated users"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Tabela de itens de navegação editáveis
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  url text NOT NULL,
  icon text,
  description text DEFAULT '',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Navigation items are viewable by everyone"
  ON navigation_items
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Navigation items are editable by authenticated users"
  ON navigation_items
  FOR ALL
  TO authenticated
  USING (true);

-- Inserir configurações padrão do site
INSERT INTO site_settings (
  site_title,
  site_description,
  about_diocese,
  contact_info,
  social_links,
  meta_title,
  meta_description,
  meta_keywords
) VALUES (
  'Diocese de São Miguel Paulista',
  'Uma diocese comprometida com a evangelização e o serviço ao povo de Deus.',
  '<h2>História da Diocese</h2><p>A Diocese de São Miguel Paulista foi criada em 15 de agosto de 1981, pelo Papa João Paulo II, através da Bula "Cum Ecclesiae". Desmembrada da Arquidiocese de São Paulo, a nova circunscrição eclesiástica foi confiada aos cuidados pastorais de Dom Angélico Sândalo Bernardino, seu primeiro bispo diocesano.</p><h2>Território e População</h2><p>A Diocese abrange uma área de 1.044 km² na região leste da Grande São Paulo, atendendo a uma população de aproximadamente 1,8 milhão de habitantes. Compreende os municípios de Arujá, Biritiba-Mirim, Ferraz de Vasconcelos, Guararema, Guarulhos, Itaquaquecetuba, Mogi das Cruzes, Poá, Salesópolis, Santa Isabel e Suzano.</p><h2>Missão</h2><p>Nossa missão é evangelizar, promover a dignidade humana e construir uma sociedade mais justa e fraterna, seguindo os ensinamentos de Jesus Cristo. Trabalhamos incansavelmente para levar a Palavra de Deus a todos os cantos de nossa diocese, especialmente aos mais necessitados.</p>',
  'Rua Voluntários da Pátria, 1264 - Santana, São Paulo - SP<br>Telefone: (11) 2221-3344<br>Email: contato@diocesesmp.org.br',
  '{"facebook": "", "instagram": "", "twitter": "", "email": "contato@diocesesmp.org.br"}',
  'Diocese de São Miguel Paulista - Igreja Católica',
  'Diocese de São Miguel Paulista - Uma comunidade de fé comprometida com a evangelização, caridade e serviço ao povo de Deus na região leste de São Paulo.',
  'diocese, são miguel paulista, igreja católica, evangelização, paróquias, padres, bispo'
) ON CONFLICT (id) DO NOTHING;

-- Inserir itens de navegação padrão
INSERT INTO navigation_items (name, slug, url, icon, description, sort_order) VALUES
  ('Paróquias', 'paroquias', '/paroquias', 'Church', 'Conheça nossas paróquias', 1),
  ('Clero', 'clero', '/clero', 'Users', 'Padres, diáconos e seminaristas', 2),
  ('Formação', 'formacao', '/formacao', 'BookOpen', 'Educação cristã e crescimento espiritual', 3),
  ('Eventos', 'eventos', '/eventos', 'Calendar', 'Celebrações e atividades', 4)
ON CONFLICT (slug) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description) VALUES
  ('Notícias', 'noticias', 'Notícias gerais da diocese'),
  ('Eventos', 'eventos', 'Eventos e celebrações'),
  ('Formação', 'formacao', 'Conteúdo de formação cristã'),
  ('Pastoral', 'pastoral', 'Atividades pastorais')
ON CONFLICT (slug) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_slider ON articles(show_in_slider);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_parishes_slug ON parishes(slug);
CREATE INDEX IF NOT EXISTS idx_priests_slug ON priests(slug);
CREATE INDEX IF NOT EXISTS idx_deacons_slug ON deacons(slug);
CREATE INDEX IF NOT EXISTS idx_seminarians_slug ON seminarians(slug);
CREATE INDEX IF NOT EXISTS idx_bishop_messages_slug ON bishop_messages(slug);

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

CREATE TRIGGER update_bishop_info_updated_at BEFORE UPDATE ON bishop_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();