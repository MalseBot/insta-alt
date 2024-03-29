import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Button } from '../button'

const LeftSidebar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const { user } = useUserContext()
  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])
  return (
    <nav className='leftsidebar h-screen'>
      <div className='flex flex-col gap-11'>
        <Link to={'/'} className='flex gap-3 items-center'>
          <img
            src='/assets/images/logo.svg'
            alt='logo'
            width={170}
            height={360}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
          <img
            src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt=''
            className=' h-14 w-14 rounded-full'
          />{' '}
          <div className='flex flex-col'>
            <p className=' body-bold capitalize'>{user.name}</p>
            <p className=' small-regular text-light-3'>@{user.username}</p>
          </div>
        </Link>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li
                key={link.label}
                className={`leftsidbar-link hover:bg-primary-500 group p-2 rounded-lg ${
                  isActive && 'bg-primary-600'
                }`}>
                <NavLink to={link.route} className={'flex gap-4 items-center'}>
                  <img
                    src={link.imgURL}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'
                    }`}
                    alt={link.label}
                  />{' '}
                  {link.label}{' '}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        className=' shad-button_ghost '
        onClick={() => signOut()}
        variant={'ghost'}>
        <img src='/assets/icons/logout.svg' alt='logout' />
        <p className='small-medium lg:base-medium'>Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
