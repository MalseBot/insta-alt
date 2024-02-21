import { bottombarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Link, useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation()
  return (
    <section className='bottom-bar '>
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route
        return (
          <Link
          key={link.label}
            to={link.route}
            className={` hover:bg-primary-500 rounded-lg group ${
              isActive && 'bg-primary-600'
            } flex-center flex-col gap-1 p-2 transition`}>
            <img
              src={link.imgURL}
              className={`group-hover:invert-white ${
                isActive && 'invert-white'
              }`}
              width={16}
              height={16}
              alt={link.label}
            />{' '}
            <p className='tiny-meduim text-light-2'>{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default Bottombar
