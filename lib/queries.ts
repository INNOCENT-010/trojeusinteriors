import { supabase } from './supabase'
import type { Project, ContactSubmission, ProductDesign } from '@/types'

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .eq('status', 'published')
    .order('year', { ascending: false })
    .limit(6)
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('year', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) { console.error(error); return null }
  return data
}

export async function get3DRenders(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('render_type', ['3d-render', 'both'])
    .eq('status', 'published')
    .order('year', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getProductDesigns(): Promise<ProductDesign[]> {
  const { data, error } = await supabase
    .from('product_designs')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function submitContactForm(payload: ContactSubmission): Promise<boolean> {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([payload])
  if (error) { console.error(error); return false }
  return true
}
