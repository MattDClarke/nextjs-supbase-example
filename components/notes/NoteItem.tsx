"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NoteForm } from "./NoteForm"
import { DeleteNote } from "./DeleteNote"
import { Edit, Trash2 } from "lucide-react"
import { Note } from "@/app/actions"

interface NoteItemProps {
  note: Note
}

export function NoteItem({ note }: NoteItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700/20 rounded-lg p-4 hover:shadow-md dark:hover:shadow-gray-700/30 transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{note.title}</h2>
          {note.content && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">{note.content}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditOpen(true)}
            className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit note</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsDeleteOpen(true)}
            className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete note</span>
          </Button>
        </div>
      </div>
      
      <NoteForm 
        note={note} 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
      />
      
      <DeleteNote 
        noteId={note.id as string} 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
      />
    </div>
  )
} 