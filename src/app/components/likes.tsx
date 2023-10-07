'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Profile, Tweet } from '../../../lib/tweet.type'
import { useRouter } from 'next/navigation'

export type TweetWithAuthor = Tweet & {
  author: Profile
  likes: number
  user_has_likes_tweet: boolean
}

const Likes = ({ tweet, addOptimisticTweet }: { tweet: TweetWithAuthor; addOptimisticTweet: (tweet: TweetWithAuthor) => void }) => {
  const router = useRouter()

  const handleLikes = async () => {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      if (tweet.user_has_likes_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_likes_tweet: !tweet.user_has_likes_tweet,
        })
        await supabase
          .from('likes')
          .delete()
          .match({ tweet_id: tweet.id, user_id: user?.id })
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_likes_tweet: !tweet.user_has_likes_tweet,
        })
        await supabase.from('likes').insert({ tweet_id: tweet.id, user_id: user?.id })
      }
      router.refresh()
    }
  }
  return (
    <button onClick={handleLikes}>
      {tweet.likes} Likes {tweet.author.username}
    </button>
  )
}

export default Likes
