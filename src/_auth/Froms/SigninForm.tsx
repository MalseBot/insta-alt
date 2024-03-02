import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Loader from '@/components/ui/shared/Loader'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
})

const SigninForm = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const { mutateAsync: signInAccount, isPending } =
    useSignInAccount()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })
    if (!session) {
      return toast({ title: 'Sign in failed. please try again' })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()
      navigate('/')
    } else {
      return toast({ title: 'sign In failed please try again' })
    }
  }
  return (
    <Form {...form}>
      <div className='sm:w-420 flex-col flex-center'>
        <img src='/assets/images/logo.svg' alt='logo' />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          Log in to your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular'>
          welcome back please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-5 w-full mt4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type='email' className=' shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type='password' className=' shad-input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='shad-button_primary'>
            {isPending||isUserLoading ? (
              <div className='flex items-center gap-2'>
                <Loader />
                Loading ...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
          <p className='text-small-regular text-light-2 text-center'>
            You don't have an account?{' '}
            <Link
              to={'/sign-up'}
              className='text-primary text-primary-500 text-small-semibold ml-1'>
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SigninForm
