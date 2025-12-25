import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import RoleMiddleWare from '../auth/RoleMiddleWare' // Import your AuthCallback

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route   key={idx} element={
                  route.allowedRoles ? (
                    <RoleMiddleWare allowedRole={route.allowedRoles} />
                  ) : (
                    <React.Fragment></React.Fragment>
                  )
                }>
                <Route
              
                  path={route.path}
                  exact={route.exact}
                  element={

                    <route.element />
                  }
                />
                </Route>
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
