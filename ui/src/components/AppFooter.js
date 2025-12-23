import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://s1njuaw.vercel.app" target="_blank" rel="noopener noreferrer">
          S1nju
        </a>
        <span className="ms-1">&copy; 2025 Bouhaik anes mohammed el amine.</span>
      </div>
      
    </CFooter>
  )
}

export default React.memo(AppFooter)
