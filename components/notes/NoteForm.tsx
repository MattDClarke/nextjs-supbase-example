"use client"

import { useState } from "react"
import { Note, createNote, updateNote } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

interface NoteFormProps {
  note?: Note
  isOpen: boolean
  onClose: () => void
}

export function NoteForm({ note, isOpen, onClose }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isEditing = !!note?.id
  
  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = isEditing 
        ? await updateNote(formData)
        : await createNote(formData)
        
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    } catch (e) {
      setError("An unexpected error occurred");
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Note" : "Create Note"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit the details of your note below." : "Fill in the details to create a new note."}
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-4">
          {isEditing && (
            <input type="hidden" name="id" value={note.id} />
          )}
          
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 dark:bg-red-600 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium dark:text-gray-200">
              Title
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={note?.title || ""}
              placeholder="Note title"
              required
              disabled={isSubmitting}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium dark:text-gray-200">
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              defaultValue={note?.content || ""}
              placeholder="Write your note here..."
              rows={5}
              disabled={isSubmitting}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 