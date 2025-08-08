'use client'
import { useAuthStore } from '@/app/store/user'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

function Logout() {
  let {reset}=useAuthStore()
  let router=useRouter()
  useEffect(()=>{
        reset();
        router.push('/auth/login')
  },[])
  return (
    <div>Logout</div>
  )
}

export default Logout