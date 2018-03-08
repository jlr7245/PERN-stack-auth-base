import React, { Component } from 'react'
import { registerUser } from '../../actions/auth'
import { connect } from 'react-redux'

class LoginForm extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      email: ''
    }
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(evt) {
    const { name, value } = evt.target
    this.setState({
      [name]: value
    })
  }

  handleFormSubmit(evt) {
    evt.preventDefault()
    this.props.registerUser(this.state)
  }

  render() {
    const { username, password, email } = this.state
    return (
      <form onSubmit={this.handleFormSubmit}>
        <input 
          name="username"
          placeholder="username"
          type="text"
          onChange={this.handleInputChange}
          value={username}
        />
        <input
          name="password"
          placeholder="password"
          type="text"
          onChange={this.handleInputChange}
          value={password}
        />
        <input
          name="email"
          placeholder="email"
          type="email"
          onChange={this.handleInputChange}
          value={email}
        />
        <input type="submit" value="Log in" />
      </form>
    )
  }
  
}

const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
  registerUser: (userInfo) => dispatch(registerUser(userInfo))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
