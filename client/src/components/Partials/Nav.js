import React from 'react'
import { Link } from 'react-router-dom'

const Nav = ({ isAuth }) => (
  <nav>
    {isAuth
      ? `You're logged in!`
      : (
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Log In</Link></li>
        </ul>
      )}
  </nav>
)

export default Nav
