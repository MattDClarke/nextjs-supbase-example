"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NoteForm } from "./NoteForm"
import { Plus } from "lucide-react"

interface CreateNoteProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
}

export function CreateNote({ variant = "outline" }: CreateNoteProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant={variant}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>New Note</span>
      </Button>
      
      <NoteForm 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
} 