export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category_id: string;
  tags: string[];
  author_id: string;
  published: boolean;
  show_in_slider: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface BishopMessage {
  id: string;
  title: string;
  content: string;
  featured_image?: string;
  published: boolean;
  created_at: string;
}

export interface BishopInfo {
  id: string;
  name: string;
  bio: string;
  photo?: string;
  ordination_date: string;
  appointment_date: string;
  updated_at: string;
}

export interface Priest {
  id: string;
  name: string;
  photo?: string;
  ordination_date: string;
  current_parish_id?: string;
  phone?: string;
  email?: string;
  bio?: string;
  status: 'active' | 'retired' | 'transferred';
  created_at: string;
}

export interface Deacon {
  id: string;
  name: string;
  photo?: string;
  ordination_date: string;
  parish_id?: string;
  phone?: string;
  email?: string;
  bio?: string;
  status: 'active' | 'retired';
  created_at: string;
}

export interface Seminarian {
  id: string;
  name: string;
  photo?: string;
  seminary: string;
  year_of_study: number;
  phone?: string;
  email?: string;
  bio?: string;
  created_at: string;
}

export interface Parish {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  priest_id?: string;
  mass_schedule: string;
  photo?: string;
  description?: string;
  created_at: string;
  priest?: Priest;
}

export interface PopupAnnouncement {
  id: string;
  title: string;
  content: string;
  image?: string;
  active: boolean;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  logo_url?: string;
  site_title: string;
  site_description: string;
  about_diocese: string;
  contact_info: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  updated_at: string;
}