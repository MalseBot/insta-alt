import Loader from '@/components/ui/shared/Loader'
import UserCard from '@/components/ui/shared/UserCard'
import { getAllUsers } from '@/lib/appwrite/api'
import { useGetAllUsers } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

function AllUsers() {
  console.log(getAllUsers())
  const { data: users, isPending: isUserLoading } = useGetAllUsers()
  return (
    <div className='w-full m-10 '>
      <div className='flex mb-10 ms-0'>
        <img
          src='/public/assets/icons/people.svg'
          width={30}
          height={30}
          className=' mx-1'
        />
        <h2 className='font-bold text-3xl'> All Users</h2>
      </div>

      {isUserLoading && !users ? (
        <Loader />
      ) : (
        <ul className='grid grid-cols-3 grid-rows-3 w-full gap-9'>
          {users?.documents.map((user: Models.Document) => (
            <UserCard key={user.caption} users={user} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default AllUsers
