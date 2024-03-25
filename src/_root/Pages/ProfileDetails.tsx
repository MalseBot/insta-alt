import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext'
import { useGetUserPosts } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function ProfileDetails() {
  const { pathname } = useLocation()
  const viewedProfile = pathname.replace('/profile/', '')
  const { user } = useUserContext()
  const { data: userId } = useGetUserPosts(viewedProfile)
  const [section, setSection] = useState('posts')

  return (
    <div className=' w-full m-5'>
      <div className='flex w-full flex-row gap-5 '>
        <div>
          <img
            className='rounded-full shadow-2xl'
            src={userId?.imageUrl}
            alt=''
            width={150}
            height={150}
          />
        </div>
        <div className='w-full m-5'>
          <div className=' flex flex-row justify-between '>
            <h2 className=' text-3xl font-bold capitalize'>{userId?.name}</h2>
            <Link
              to={`/update-profile/${userId?.$id}`}
              className={` ${userId?.$id !== user.id ? 'hidden' : ''} `}>
              <Button className='shad-button_dark_4'>
                <img
                  src='/assets/icons/edit.svg'
                  alt='edit'
                  width={20}
                  height={20}
                />
                Edit Profile
              </Button>
            </Link>
          </div>
          <h3 className='small-regular text-light-3'>@{userId?.username}</h3>
          <p>{user.bio}</p>
        </div>
      </div>
      <div className='w-full flex justify-around '>
        <button
          className='flex gap-2 border-x border-opacity-50 border-purple-950 w-full justify-center bg-slate-700 bg-opacity-15 py-3 rounded-3xl'
          onClick={() => {
            setSection('posts')
          }}>
          <img src='/assets/icons/posts.svg' />
          Posts
        </button>
        <button
          onClick={() => {
            setSection('liked')
          }}
          className='flex gap-2 border-x border-opacity-25 border-purple-950 w-full justify-center bg-slate-700 bg-opacity-15 py-3 rounded-3xl'>
          <img src='/assets/icons/liked.svg' />
          Liked
        </button>
        <button
          onClick={() => {
            setSection('saved')
          }}
          className={`flex gap-2 border-x border-opacity-25 border-purple-950 w-full justify-center bg-slate-700 bg-opacity-15 py-3 rounded-3xl ${
            user.id !== userId?.$id && 'hidden'
          }`}>
          <img src='/assets/icons/saved.svg' />
          Saves
        </button>
      </div>
      <ul
        className={` ${
          section === 'posts' ? 'grid' : 'hidden'
        } grid-cols-3 gap-7 mt-10`}>
        {userId?.posts.map((post: Models.Document) => (
          <li
            key={post.$createdAt}
            className=' shadow-inner hover:scale-105 duration-500'>
            <Link className='' to={`/posts/${post.$id}`}>
              <img className=' rounded-2xl' src={post.imageUrl} alt='' />
            </Link>
          </li>
        ))}
      </ul>
      <ul
        className={` ${
          section === 'liked' ? 'grid' : 'hidden'
        } grid-cols-3 gap-7 mt-10`}>
        {userId?.liked.map((post: Models.Document) => (
          <li
            key={post.$createdAt}
            className=' shadow-inner hover:scale-105 duration-500'>
            <Link className='' to={`/posts/${post.$id}`}>
              <img className=' rounded-2xl' src={post.imageUrl} alt='' />
            </Link>
          </li>
        ))}
      </ul>
      <ul
        className={`${
          user.id !== userId?.$id
            ? '!hidden'
            : `${section === 'saved' ? 'grid' : 'hidden'}`
        }  grid-cols-3 gap-7 mt-10`}>
        {userId?.save.map((post: Models.Document) => (
          <li
            key={post.$createdAt}
            className=' shadow-inner hover:scale-105 duration-500'>
            <Link className='' to={`/posts/${post.$id}`}>
              <img className=' rounded-2xl' src={post.post.imageUrl} alt='' />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileDetails
