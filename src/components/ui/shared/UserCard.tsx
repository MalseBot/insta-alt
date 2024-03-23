import { Models } from 'appwrite'
import { Link } from 'react-router-dom'

type UserCardProps = {
  users: Models.Document
}
//imageUrl name username $id
function UserCard({ users }: UserCardProps) {
  return (
    <div className=' border rounded-2xl border-light-4 border-opacity-20'>
      <Link
        to={`/profile/${users.$id}`}
        state={{ some: 'path' }}
        className='flex m-5 flex-col items-center'>
        <img
          src={users.imageUrl}
          alt='profile image'
          className=' w-2/4 rounded-full m-5'
        />
        <h3 className=' text-2xl font-bold capitalize'>{users.name}</h3>
        <h4 className='small-regular text-light-3'>@{users.username}</h4>
      </Link>
    </div>
  )
}

export default UserCard
