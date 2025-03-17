import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>
      <ul className="space-y-4">
        {notes?.map((note) => (
          <li key={note.id} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  )
}