import React, { FC } from 'react'
interface AuthProps{
    children:React.ReactNode
}
const AuthLayout:FC<AuthProps> = ({children}) => {
  return (
    <div className='flex justify-center items-center min-h-screen w-screen' >
{children}
    </div>
  )
}

export default AuthLayout