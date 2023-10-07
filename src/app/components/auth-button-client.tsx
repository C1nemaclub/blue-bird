'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

interface AuthButtonClientProps {
  session: Session | null
}

const AuthButtonClient: FC<AuthButtonClientProps> = ({ session }) => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return <>{session ? <button onClick={handleSignOut}>Logout</button> : <button onClick={handleSignIn}>Login</button>}</>
}

export default AuthButtonClient
