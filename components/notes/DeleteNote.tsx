"use client"

import { useState } from "react"
import { deleteNote } from "@/app/actions/notes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"

interface DeleteNoteProps {
  noteId: string
  isOpen: boolean
  onClose: () => void
}

export function DeleteNote({ noteId, isOpen, onClose }: DeleteNoteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  async function handleDelete() {
    setIsDeleting(true)
    setError(null)
    
    try {
      const result = await deleteNote(noteId)
      
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    } catch (e) {
      setError("An unexpected error occurred")
      console.error(e)
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The note will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 dark:text-gray-300">
          Are you sure you want to delete this note?
        </div>
        
        {error && (
          <div className="p-3 text-sm text-white bg-red-500 dark:bg-red-600 rounded">
            {error}
          </div>
        )}
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 