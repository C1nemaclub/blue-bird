'use client'
import Likes, { TweetWithAuthor } from './likes'
import { useEffect, experimental_useOptimistic as useOptimistic } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

type TweetsProps = {
  tweets: TweetWithAuthor[]
}

const Tweets = ({ tweets }: TweetsProps) => {
  const router = useRouter()
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
    tweets,
    (currentOptimisticTweets, newTweet) => {
      const newOptimisticTweets = [...currentOptimisticTweets]
      const index = newOptimisticTweets.findIndex((tweet) => tweet.id === newTweet.id)
      newOptimisticTweets[index] = newTweet
      return newOptimisticTweets
    },
  )

  const supabase = createClientComponentClient<Database>()
  useEffect(() => {
    const channeL = supabase
      .channel('realtime tweets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tweets',
        },
        (payload) => {
          router.refresh()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channeL)
    }
  }, [router, supabase])
  return (
    <>
      {optimisticTweets.map((tweet) => {
        return (
          <div key={tweet.id}>
            <p>
              {tweet.author.name.replaceAll(`"`, '')} {tweet.author.username.replaceAll(`"`, '')}
            </p>
            <p>{tweet.title}</p>
            <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
          </div>
        )
      })}
    </>
  )
}

export default Tweets
