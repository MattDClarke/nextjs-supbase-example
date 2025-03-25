import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { NoteItem } from '@/components/notes/NoteItem';
import { CreateNote } from '@/components/notes/CreateNote';
import { getNotes, Note } from '../actions';

export default async function NotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // This will throw an error if there's a problem, which will
  // bubble up to the nearest error boundary
  const notes = await getNotes() as Note[];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">My Notes</h1>
        <CreateNote />
      </div>
      
      {notes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any notes yet.</p>
          <CreateNote variant="default" />
        </div>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteItem note={note} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}