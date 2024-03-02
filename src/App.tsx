import { Routes, Route } from 'react-router-dom'
import './globals.css'
import { AllUsers, CreatePost, EditPost, Explore, Home, Profile, ProfileDetails, Saved, UpdateProfile } from './_root/Pages/'
import SigninForm from './_auth/Froms/SigninForm'
import SignupForm from './_auth/Froms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from '@/components/ui/toaster'
import PostDetails from './_root/Pages/PostDetails'

const App = () => {
  return (
    <main>
      <Routes>
        {/*public*/}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/*private */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:id' element={<EditPost />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='/profile/:id' element={<ProfileDetails />} />
          <Route path={`/posts/:id/*`} element={<PostDetails/>}/>
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
