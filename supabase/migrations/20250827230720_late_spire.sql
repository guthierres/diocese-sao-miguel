/*
  # Create home sections table

  1. New Tables
    - `home_sections`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `link_url` (text)
      - `active` (boolean)
      - `order_index` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `home_sections` table
    - Add policies for authenticated users to manage and public to read
*/

CREATE TABLE IF NOT EXISTS home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Church',
  link_url text NOT NULL,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Home sections are viewable by everyone"
  ON home_sections
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Home sections are editable by authenticated users"
  ON home_sections
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default home sections
INSERT INTO home_sections (title, description, icon, link_url, order_index) VALUES
('Paróquias', 'Conheça as comunidades de fé da nossa diocese', 'Church', '/paroquias', 1),
('Clero', 'Nossos padres, diáconos e seminaristas', 'Users', '/clero', 2),
('Notícias', 'Fique por dentro das novidades', 'FileText', '/noticias', 3),
('Contato', 'Entre em contato conosco', 'Mail', '/contato', 4)
ON CONFLICT DO NOTHING;