export type ProjectCategory = 'residential' | 'commercial' | 'hospitality' | 'product'
export type RenderType = '3d-render' | 'photography' | 'both'

export interface Project {
  id: string
  title: string
  slug: string
  category: ProjectCategory
  description: string
  location: string
  year: number
  cover_image: string
  images: string[]
  featured: boolean
  render_type: RenderType
  status: 'published' | 'draft'
  created_at: string
}

export interface ProductDesign {
  id: string
  title: string
  slug: string
  description: string
  category: 'bedframe' | 'cushion' | 'bedwall' | 'lighting' | 'accessory'
  images: string[]
  featured: boolean
  status: 'published' | 'draft'
}

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  phone?: string
  message: string
  project_type?: string
  budget_range?: string
  status?: 'new' | 'read' | 'replied'
  created_at?: string
}
export interface DreamSpace {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  images: string[]
  related_project_slug: string | null
  featured: boolean
  sort_order: number
  status: string
  created_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string | null
  updated_at: string
}

