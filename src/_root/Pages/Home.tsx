import Loader from '@/components/ui/shared/Loader'
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPost,
  } = useGetRecentPosts()
  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home feed</h2>
          {isPostLoading && !posts ? <Loader /> : <ul className='flex flex-1 flex-col w-full gap-9'>
            {posts?.documents.map((post:Models.Document)=>(
              <li key={post.label}>{post.caption}</li>
            ))}
            </ul>}
        </div>
      </div>
    </div>
  )
}

export default Home
