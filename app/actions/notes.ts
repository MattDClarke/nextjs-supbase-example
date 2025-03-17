'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Note = {
  id?: string
  title: string
  content?: string
  user_id?: string
}

export async function getNotes() {
  const supabase = await createClient()
  const { data: notes, error } = await supabase.from('notes').select('*')
  
  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }
  
  return notes
}

export async function createNote(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!title) {
    return { error: 'Title is required' }
  }
  
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { error: 'User not authenticated' }
  }
  
  const { error } = await supabase.from('notes').insert({
    title,
    content,
    user_id: userData.user.id
  })
  
  if (error) {
    console.error('Error creating note:', error)
    return { error: error.message }
  }
  
  revalidatePath('/notes')
  return { success: true }
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!id || !title) {
    return { error: 'ID and title are required' }
  }
  
  const { error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating note:', error)
    return { error: error.message }
  }
  
  revalidatePath('/notes')
  return { success: true }
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  
  if (!id) {
    return { error: 'ID is required' }
  }
  
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting note:', error)
    return { error: error.message }
  }
  
  revalidatePath('/notes')
  return { success: true }
} 