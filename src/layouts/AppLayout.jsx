import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AppLayout = () => {
  return (
    <div className='px-10'>
      <main className='container min-h-screen' >
        <Header/>
        <Outlet/>
      </main>
      <div className='p-10 text-center bg-gray-800 mt-10'>
             Made with ❤️ by 757
      </div>
    </div>
  )
}

export default AppLayout
