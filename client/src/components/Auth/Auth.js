import React from 'react'
import { Redirect } from 'react-router-dom'

const Auth = ({ isAuth, children }) => (
  <div className="auth">
    {children}
    {isAuth && <Redirect push to="/" />}
  </div>
)

export default Auth
