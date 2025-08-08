import React from 'react'

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        {children}
    </div>
  )
}

export default Layout