import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import { useEffect, useState } from 'react'
import Loader from './Loader'
type PostStatsProps = {
  post: Models.Document
  userId: string
}
function PostStats({ post, userId }: PostStatsProps) {
  const likesList = post.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)
  const { mutate: likePost, isPending: isSavingPost } = useLikePost()
  const { mutate: savePost, isPending: isDeletingSave } = useSavePost()
  const { mutate: deleteSavePost } = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savePostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  )

  useEffect(() => {
    setIsSaved(!!savePostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    let newLikes = [...likes]
    const hasLiked = newLikes.includes(userId)
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes)
    likePost({ postId: post.$id, likeArray: newLikes })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savePostRecord) {
      setIsSaved(false)
      return deleteSavePost(savePostRecord.$id)
    }
      setIsSaved(true)
      savePost({ postId: post.$id, userId:userId })
    
  }

  return (
    <div className='flex justify-between items-center z-20'>
      <div className=' flex gap-2 mr-5'>
        <img
          src={
            checkIsLiked(likes, userId)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }
          width={20}
          height={20}
          onClick={handleLikePost}
          className=' cursor-pointer'
        />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>
      <div className=' flex gap-2 '>
        {isSavingPost || isDeletingSave ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
            width={20}
            height={20}
            onClick={handleSavePost}
            className=' cursor-pointer'
          />
        )}
      </div>
    </div>
  )
}

export default PostStats
