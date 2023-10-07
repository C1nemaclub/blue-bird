export type Tweet = Database['public']['Tables']['tweets']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
type Likes = Database['public']['Tables']['likes']['Row']

export type TweetEntity = Tweet & {
  likes: Likes[]
  profiles: Profile | null
}
