import React from 'react'
import Header from '@/components/custom/header'
function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default Layout