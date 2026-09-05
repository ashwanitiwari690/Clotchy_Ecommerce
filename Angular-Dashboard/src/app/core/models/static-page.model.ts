export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}
