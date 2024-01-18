import { Routes, Route } from 'react-router-dom'
import './globals.css'
import { Home } from './_root/Pages/'
import SigninForm from './_auth/Froms/SigninForm'
import SignupForm from './_auth/Froms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from '@/components/ui/toaster'

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
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
