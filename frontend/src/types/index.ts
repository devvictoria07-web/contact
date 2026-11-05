export type UserRole = 'admin' | 'owner' | 'visitor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  created_at: string;
}

export interface City {
  id: number;
  name: string;
  department: string;
  slug: string;
  businesses_count?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  businesses_count?: number;
}

export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export interface Business {
  id: number;
  user_id: number;
  city_id: number;
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  address: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  opening_hours?: string | null;
  logo_path?: string | null;
  logo_url?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  status: BusinessStatus;
  admin_notes?: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  city?: City;
  categories?: Category[];
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
  };
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PublicStats {
  total_businesses: number;
  total_categories: number;
  total_cities: number;
  departments_covered: number;
}

export interface AdminStats {
  businesses: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  users: {
    total: number;
    owners: number;
    visitors: number;
  };
  categories_count: number;
  cities_count: number;
  latest_pending: Business[];
}

