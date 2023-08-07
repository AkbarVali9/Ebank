import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    userPin: '',
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      userId: '',
      userPin: '',
      errorMsg,
    })
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state

    const loginApiUrl = 'https://apis.ccbp.in/ebank/login'
    const userDetails = {
      user_id: userId,
      pin: userPin,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onchangeUserPin = event => {
    this.setState({userPin: event.target.value})
  }

  render() {
    const {userId, userPin, errorMsg} = this.state

    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="login-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="website-login-image"
          />
          <form className="login-form-container" onSubmit={this.onSubmitForm}>
            <h1 className="heading-greetings">Welcome back!</h1>

            <div className="input-wrapper">
              <label htmlFor="userIdInput" className="label">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                id="userIdInput"
                className="input"
                onChange={this.onChangeUserId}
              />
            </div>

            <div className="input-wrapper">
              <label htmlFor="userPinInput" className="label">
                PIN
              </label>
              <input
                type="password"
                placeholder="Enter PIN"
                value={userPin}
                id="userPinInput"
                className="input"
                onChange={this.onchangeUserPin}
              />
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
            <p className="error-message">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
