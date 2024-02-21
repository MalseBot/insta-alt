import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import FileUpLoader from '../ui/shared/FileUpLoader'
import { Models } from 'appwrite'
import { useUserContext } from '@/context/AuthContext'
import { useCreatePost } from '@/lib/react-query/queriesAndMutations'
import { useToast } from '../ui/use-toast'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(5).max(2200),
  tags: z.string(),
})

type PostFromProps = {
  post?: Models.Document
  action: 'Create'
}
function PostForm({ post, action }: PostFromProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()
  console.log(action)
  console.log(post)

  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : '',
    },
  })

  // 2. Define a submit handler.
  function handleSubmit(value: z.infer<typeof formSchema>) {
    const newPost = createPost({
      ...value,
      userId: user.id,
    })

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      })
    }
    console.log('its good')

    navigate('/')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-col gap-9 w-full max-w-5xl'>
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form-label'>Caption</FormLabel>
              <FormControl>
                <Textarea
                  className='shad-textarea custom-scrollbar'
                  placeholder='shadcn'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_massage' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form-label'>Add Photos</FormLabel>
              <FormControl>
                <FileUpLoader
                  feildChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className='shad-form_massage' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form-label'>Add Location</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='shad-input'
                  placeholder='Paris , burger king'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_massage' />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form-label'>
                Add Tags(separated by comma ' , ')
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='shad-input'
                  placeholder='Art , expression , Learn'
                  {...field}
                />
              </FormControl>
              <FormMessage className='shad-form_massage' />
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-center justify-end'>
          <Button
            type='submit'
            className='shad-button_primary whitespace-nowrap'>
            {action} Post
          </Button>
          <Button type='button' className='shad-button_dark_4'>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
