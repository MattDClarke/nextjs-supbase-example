'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import * as Sentry from "@sentry/nextjs";
import { wait } from '@/lib/utils';

export type Note = {
  id?: string
  title: string
  content?: string
  user_id?: string
}

export async function getNotes() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return []
  }
  
  // Only fetch notes belonging to the current user
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userData.user.id)
  
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
  
  // Intentionally wait for 20 seconds to trigger a TaskCanceledException
  await wait(20000)
  
  // Create note object with available fields
  const noteData: { title: string; content?: string; user_id: string } = { 
    title, 
    content,
    user_id: userData.user.id
  }
  
  const { error } = await supabase.from('notes').insert(noteData)
  
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
  
  // Get the current user
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { error: 'User not authenticated' }
  }
  
  // Verify note ownership before update
  const { data: note } = await supabase
    .from('notes')
    .select('user_id')
    .eq('id', id)
    .single()
    
  if (!note) {
    return { error: 'Note not found' }
  }
  
  if (note.user_id !== userData.user.id) {
    return { error: 'You can only update your own notes' }
  }
  
  // // Proceed with update after ownership verification
  // const { error } = await supabase
  //   .from('notes')
  //   .update({ title, content })
  //   .eq('id', id)
  //   .eq('user_id', userData.user.id)  



    // Use executeRaw with pg_sleep to simulate slow network
    const { error } = await supabase.rpc('slow_update', {
      p_id: id,
      p_title: title,
      p_content: content,
      p_user_id: userData.user.id
    })
  
    if (error) {
      console.error('Error updating note:', error);

      Sentry.captureException(error);

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
  
  // Get the current user
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { error: 'User not authenticated' }
  }
  
  // Verify note ownership before deletion
  const { data: note } = await supabase
    .from('notes')
    .select('user_id')
    .eq('id', id)
    .single()
    
  if (!note) {
    return { error: 'Note not found' }
  }
  
  if (note.user_id !== userData.user.id) {
    return { error: 'You can only delete your own notes' }
  }
  
  // Proceed with deletion after ownership verification
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id) // Additional security layer
  
  if (error) {
    console.error('Error deleting note:', error)
    return { error: error.message }
  }
  
  revalidatePath('/notes')
  return { success: true }
} 