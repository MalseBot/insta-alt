import UpdateProfileForm from '@/components/Forms/UpdateProfileForm'
import { useUserContext } from '@/context/AuthContext'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'

function UpdateProfile() {
  const { user } = useUserContext()
  const { data: profile } = useGetCurrentUser()

  return (
    <div className='w-full'>
      <UpdateProfileForm profile={profile} />
    </div>
  )
}

export default UpdateProfile
