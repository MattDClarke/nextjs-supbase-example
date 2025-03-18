import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();


  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-5xl mb-4">Notes app</h2>

        {/* {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
        {!user ? (
          <div className="max-w-2xl">
            <p className="text-lg text-gray-600 mb-4 dark:text-gray-300">
              Welcome to Notes - your simple, secure digital notebook. Capture your thoughts, ideas, and important information with ease. Our minimalist design helps you focus on what matters most: your content.
            </p>
        </div>
        ) : redirect('/notes')}
      </main>
    </>
  );
}
