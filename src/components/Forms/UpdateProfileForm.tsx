import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import ProfileUploader from '../ui/shared/ProfileUploader'
import { Input } from '../ui/input'
;('use client')
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useUserContext } from '@/context/AuthContext'
import { toast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { useUpdateUser } from '@/lib/react-query/queriesAndMutations'
import { Models } from 'appwrite'

const formSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(2200),
  file: z.custom<File[]>(),
})

function UpdateProfileForm(userData?: Models.Document) {
  const { user } = useUserContext()
  const profile = userData?.profile
  const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:profile? profile.name:user.name,
      bio:profile? profile.bio:user.bio,
      file: [],
    },
  })
  const { mutateAsync: updateUser, isPending: isLoading } = useUpdateUser()
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const updatedUser = await updateUser({
      ...values,
      imageUrl: profile?.imageUrl,
      userId: user.id,
      imageId: profile?.imageId,
    })
    console.log(profile.$id)

    if (!updatedUser) {
      toast({ title: 'Please try again' })
      throw Error()
    }
    return navigate(`/profile/${user.id}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-9 w-full max-w-5xl'>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProfileUploader
                  feildChange={field.onChange}
                  mediaUrl={user.imageUrl}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='name' className=' text-black' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio :</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='I am from egypt
                  i love playing basketball'
                  className=' text-black'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-center justify-end'>
          <Button
            className='shad-button_primary whitespace-nowrap'
            type='submit'
            disabled={isLoading}>
            Submit
          </Button>{' '}
          <Button onClick={()=>navigate('/')} type='button' className='shad-button_dark_4'>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateProfileForm
