import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Context from '../../context'
import logo from '../../assets/images/logo.png'
import axios from 'axios'

export default function Register(props) {
  const context = useContext(Context)
  useEffect(() => {
    context.setLoaderProgress(100)
    // eslint-disable-next-line
  }, [])

  const [credentials, setCredentials] = useState(
    {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      rpassword: ''
    }
  )

  const [isProgress, setIsProgress] = useState(false)
  const [inputError, setInputError] = useState(
    {
      phone: null,
      password: null,
      rpassword: null,
      email: null,
      full_name: null
    }
  )


  const inputChange = (e) => {
    let updated = { [e.target.id]: e.target.value }
    setCredentials((prevCred) => ({ ...prevCred, ...updated }))
    validateFields(e)
  }

  const validateEmail = (email) => {
    // eslint-disable-next-line
    return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  }


  const validateFields = (e) => {
    // for phone 
    if (e.target.value && e.target.id === "phone" && isNaN(e.target.value)) {
      setInputError((prev) => ({ ...prev, phone: "Enter 10 digit phone number" }))
    } else if (e.target.value && e.target.id === "phone" && !isNaN(e.target.value) && (e.target.value.length !== 10)) {
      setInputError((prev) => ({ ...prev, phone: "Enter 10 digit phone number" }))
    } else if (e.target.value && e.target.id === "phone" && !isNaN(e.target.value) && (e.target.value.length === 10)) {
      setInputError((prev) => ({ ...prev, phone: false }))
    }

    // for email
    if (e.target.value && e.target.id === "email") {
      if (!validateEmail(e.target.value)) {
        setInputError((prev) => ({ ...prev, email: 'Enter valid email address' }))
      } else {
        setInputError((prev) => ({ ...prev, email: false }))
      }
    }

    // for password
    if (e.target.value && e.target.id === "password" && (e.target.value.length < 6)) {
      setInputError((prev) => ({ ...prev, password: "minimum 6 characters" }))
    } else if (e.target.value && e.target.id === "password" && (e.target.value.length >= 6)) {
      setInputError((prev) => ({ ...prev, password: false }))
    }

    // for reenter password
    if (e.target.value && e.target.id === "rpassword" && (credentials.password !== e.target.value)) {
      setInputError((prev) => ({ ...prev, rpassword: "Password does not match" }))
    } else if (e.target.value && e.target.id === "rpassword" && (credentials.password === e.target.value)) {
      setInputError((prev) => ({ ...prev, rpassword: false }))
    }

    // for full_name
    if (e.target.value && e.target.id === "full_name" && (e.target.value.length < 3)) {
      setInputError((prev) => ({ ...prev, full_name: "Minimum 3 characters" }))
    } else if (e.target.value && e.target.id === "full_name" && (e.target.value.length >= 3)) {
      setInputError((prev) => ({ ...prev, full_name: false }))
    }

    // if empty 
    if (!e.target.value) {
      let error = { [e.target.id]: null }
      setInputError((prev) => ({ ...prev, ...error }))
    }
  }


  const isValidFields = () => {
    let isError = [];
    Object.values(inputError).forEach(ele => {
      if (ele !== false && ele != null) {
        isError.push("error")
      }
    })
    return !isError.includes("error")
  }


  const formSumbit = (e) => {
    e.preventDefault()
    if (!isValidFields()) {
      return false;
    }
    setIsProgress(true)
    axios.post(`${process.env.REACT_APP_API_URL}/admin`, credentials).then((response) => {
      let result = response.data
      if (result.status === 1) {
        // success
        let JWT = result.jwt
        delete result.data.password
        props.signIn(JSON.stringify(result.data), JWT)
      } else {
        // error
        Object.keys(result.data).forEach((key) => {
          if (Object.keys(credentials).includes(key)) {
            setInputError((prev) => ({ ...prev, [key]: result.data[key].toString() }))
          } else {
            context.setToastData({ type: 'error', message: result.data[key].toString() })
          }
        })
      }
    }).finally(() => setIsProgress(false))
  }






  return (
    <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center m-auto">
      <div className="w-100 card rounded bg-white border-0 shadow-sm m-3 p-4" style={{ maxWidth: '510px' }}>
        <img className="mx-auto rounded-1 mb-4 pb-2 w-100" src={logo} alt="Dayansh Logo" height="85" />
        <form onSubmit={formSumbit}>
          <div className="form-floating mb-3">
            <input type="text" className={`form-control shadow-none is-${inputError.full_name ? 'invalid' : inputError.full_name == null ? '' : 'valid'}`} id="full_name" placeholder='Full Name' value={credentials.full_name} onChange={inputChange} required />
            <label htmlFor="full_name">Full Name</label>
            <span className="invalid-feedback">{inputError.full_name || ''}</span>
          </div>
          <div className="form-floating mb-3">
            <input type="email" className={`form-control shadow-none is-${inputError.email ? 'invalid' : inputError.email == null ? '' : 'valid'}`} id="email" placeholder='Email' autoComplete='usernamme' value={credentials.email} onChange={inputChange} required />
            <label htmlFor="email">Email</label>
            <span className="invalid-feedback">{inputError.email || ''}</span>
          </div>

          <div className="form-floating mb-3">
            <input type="tel" className={`form-control shadow-none is-${inputError.phone ? 'invalid' : inputError.phone == null ? '' : 'valid'}`} id="phone" placeholder='phone' value={credentials.phone} onChange={inputChange} required />
            <label htmlFor="phone">Phone no.</label>
            <span className="invalid-feedback">{inputError.phone || ''}</span>
          </div>

          <div className="form-floating mb-3">
            <input type="password" className={`form-control shadow-none is-${inputError.password ? 'invalid' : inputError.password == null ? '' : 'valid'}`} id="password" autoComplete='new-password' placeholder='Password' value={credentials.password} onChange={inputChange} required />
            <label htmlFor="password">Password</label>
            <span className="invalid-feedback">{inputError.password || ''}</span>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className={`form-control shadow-none is-${inputError.rpassword ? 'invalid' : inputError.rpassword == null ? '' : 'valid'}`} id="rpassword" autoComplete='confirm-password' placeholder='Reenter Password' value={credentials.rpassword} onChange={inputChange} required />
            <label htmlFor="rpassword">Reenter Password</label>
            <span className="invalid-feedback">{inputError.rpassword || ''}</span>
          </div>

          <button className="w-100 btn btn-lg btn-primary  d-flex justify-content-center" type="submit" disabled={isProgress}>
            {isProgress ? <span className="spinner-border" role="status" aria-hidden="true"></span> : 'Create Account'}
          </button>
          <p className="mt-5 mb-3 text-muted small">Already have an account? <Link to='/login' >Login</Link></p>
        </form>
      </div>
    </div>
  )
}
