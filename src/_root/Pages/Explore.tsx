import { Input } from '@/components/ui/input'
import GridPostList from '@/components/ui/shared/GridPostList'
import Loader from '@/components/ui/shared/Loader'
import SearchResults from '@/components/ui/shared/SearchResults'
import useDebounce from '@/hooks/useDebounce'
import {
  useGetPosts,
  useSearchPosts,
} from '@/lib/react-query/queriesAndMutations'
import { useState } from 'react'

const Explore = () => {
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()
  const [searchValue, setSearchValue] = useState('')
  const deBounsedValue = useDebounce(searchValue, 500)
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(deBounsedValue)

  if (!posts) return <Loader />

  const shouldShowResults = searchValue !== ''
  const shouldShowPosts =
    !shouldShowResults &&
    posts.pages.every((item) => item.documents.length === 0)
  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Post</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img
            src='/assets/icons/search.svg'
            alt='search'
            width={24}
            height={24}
          />
          <Input
            type='text'
            placeholder='Search'
            className='explore-search'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'> Popular | Today</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'></p>
          <img
            src='/assets/icons/filter.svg'
            width={20}
            height={20}
            alt='filter'
          />
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowResults ? (
          <SearchResults />
        ) : shouldShowPosts ? (
          <p className='text-light-4 mt-10 text-center w-full'>End Of Posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>
    </div>
  )
}

export default Explore
