"use client";
import React, { FC } from 'react'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'
interface Props{
    children:React.ReactNode
}
const Providers:FC<Props> = ({children}) => {
    const queryClient=new QueryClient();
  return (
    <QueryClientProvider client={queryClient} >
        {children}
    </QueryClientProvider>
  )
}

export default Providers