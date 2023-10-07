import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { FC } from 'react'

interface NewTweetProps {}

const NewTweet: FC<NewTweetProps> = ({}) => {
  const addTweet = async (formData: FormData) => {
    'use server'
    const title = String(formData.get('title'))
    const supabase = createServerActionClient<Database>({
      cookies,
    })
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('tweets').insert({ title, user_id: user.id })
      //   window.location.reload()
    }
  }
  return (
    <form action={addTweet}>
      <input className="bg-inherit" name="title" />
      <button>Submit</button>
    </form>
  )
}

export default NewTweet
