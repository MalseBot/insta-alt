import UpdateProfileForm from '@/components/Forms/UpdateProfileForm'
import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations'

function UpdateProfile() {
  const { data: profile } = useGetCurrentUser()

  return (
    <div className='w-full'>
      <UpdateProfileForm profile={profile} />
    </div>
  )
}

export default UpdateProfile
