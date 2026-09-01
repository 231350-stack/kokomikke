import { NavLink } from 'react-router-dom'
import { Map, User } from 'lucide-react'

const tabs = [
  { path: '/home',    label: '地図',         Icon: Map  },
  { path: '/profile', label: 'プロフィール', Icon: User },
]

export default function TabBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white"
      style={{
        maxWidth: '430px',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 1000,
        borderTop: '1px solid rgba(0,0,0,0.09)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.07)',
      }}
    >
      <div className="flex h-[60px]">
        {tabs.map(({ path, label, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-sage-400' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
