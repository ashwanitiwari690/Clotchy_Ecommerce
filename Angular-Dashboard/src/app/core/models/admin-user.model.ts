export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatar?: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
}
