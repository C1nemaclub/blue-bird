import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthButtonServer from './components/auth-button-server'
import { redirect } from 'next/navigation'
import NewTweet from './components/new-tweet'
import Likes from './components/likes'
import { Profile } from '../../lib/tweet.type'
import Tweets from './components/tweets'

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies })
  const { data } = await supabase.from('tweets').select('*, author:profiles(*), likes(user_id)')

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_likes_tweet: !!tweet.likes.find((like) => like.user_id === session?.user.id),
      likes: tweet.likes.length,
    })) ?? []

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2>Blue Bird</h2>
      <Tweets tweets={tweets} />
      <NewTweet />
      <AuthButtonServer />
    </main>
  )
}
