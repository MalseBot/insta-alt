import * as z from 'zod'
import { Models } from 'appwrite'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { useToast } from '../ui/use-toast'
import { useUserContext } from '@/context/AuthContext'
import FileUpLoader from '../ui/shared/FileUpLoader'
import {
  useCreatePost,
  useUpdatePost,
} from '@/lib/react-query/queriesAndMutations'

const formSchema = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(5).max(2200),
  tags: z.string(),
})

type PostFromProps = {
  post?: Models.Document
  action: 'Create' | 'Update'
}
const PostForm = ({ post, action }: PostFromProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()

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
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()

  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost()

  // 2. Define a submit handler.
  const handleSubmit = async (value: z.infer<typeof formSchema>) => {
    // ACTION = UPDATE
    if (post && action === 'Update') {
      const updatedPost= await updatePost({
        ...value,
        postId:post.$id,
        imageId:post?.imageId,
        imageUrl:post?.imageUrl
      })
      if(!updatedPost){
        toast({title:'Please try again'})
      }

      return navigate(`/posts/${post.$id}`)
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    })

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      })
    }
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
                  placeholder='beautiful'
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
            className='shad-button_primary whitespace-nowrap' disabled={isLoadingCreate || isLoadingUpdate}>
            {action} Post
          </Button>
          <Button type='button' className='shad-button_dark_4' onClick={()=>navigate('/')}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
