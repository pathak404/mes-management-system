import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Context from '../../context'
import logo from '../../assets/images/logo.png'
import axios from 'axios'

export default function Login(props) {

  const context = useContext(Context)
  useEffect(() => {
    context.setLoaderProgress(100)
    // eslint-disable-next-line
  }, [])

  
  const [credentials, setCredentials] = useState(
    {
      phone: '',
      password: ''
    }
  )


  const [isProgress, setIsProgress] = useState(false)
  const [inputError, setInputError] = useState({ phone: null, password: null })


  const inputChange = (e) => {
    let updated = { [e.target.id]: e.target.value }
    setCredentials((prevCred) => ({ ...prevCred, ...updated }))
    validateFields(e)
  }


  const validateFields = (e) => {
    // for phone
    if(e.target.value && e.target.id === "phone" && isNaN(e.target.value)){
      setInputError((prev) => ({ ...prev, phone: "Enter 10 digit phone number" }))
    }else if (e.target.value && e.target.id === "phone" && !isNaN(e.target.value) && (e.target.value.length !== 10)) {
      setInputError((prev) => ({ ...prev, phone: "Enter 10 digit phone number" }))
    } else if (e.target.value && e.target.id === "phone" && !isNaN(e.target.value) && (e.target.value.length === 10)) {
      setInputError((prev) => ({ ...prev, phone: false }))
    }

    // for password
    if (e.target.value && e.target.id === "password" && (e.target.value.length < 6)) {
      setInputError((prev) => ({ ...prev, password: "minimum 6 characters" }))
    } else if (e.target.value && e.target.id === "password" && (e.target.value.length >= 6)) {
      setInputError((prev) => ({ ...prev, password: false }))
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
      return false
    }

    setIsProgress(true)
    
    axios.post(`${process.env.REACT_APP_API_URL}/auth`, credentials).then((response) => {
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
            setInputError((prev) => ({ ...prev, phone: result.data[key].toString() }))
          } else {
            context.setToastData({ type: 'error', message: result.data[key].toString() })
          }
        })
      }
    }).finally(() => setIsProgress(false))
  }


  return (
    <div className="w-100 min-vh-100 d-flex align-items-center justify-content-center m-auto">
      <div className="w-100 card rounded bg-white border-0 shadow-sm m-3 p-4" style={{ maxWidth: '430px' }}>
        <img className="mx-auto rounded-1 mb-4 pb-2" src={logo} alt="" width="350" height="72" />
        <form onSubmit={formSumbit}>
          <div className="form-floating mb-3">
            <input type="text" className={`form-control shadow-none is-${inputError.phone ? 'invalid' : inputError.phone == null ? '' : 'valid'}`} id="phone" placeholder='phone' autoComplete='usernamme' value={credentials.phone} onChange={inputChange} required />
            <label htmlFor="phone">Phone No.</label>
            <span className="invalid-feedback">{inputError.phone || ''}</span>
          </div>
          <div className="form-floating mb-3">
            <input type="password" className={`form-control shadow-none is-${inputError.password ? 'invalid' : inputError.password == null ? '' : 'valid'}`} id="password" placeholder='password' autoComplete="current-password" value={credentials.password} onChange={inputChange} required />
            <label htmlFor="password">Password</label>
            <span className="invalid-feedback">{inputError.password || ''}</span>
          </div>

          <button className="w-100 btn btn-lg btn-primary  d-flex justify-content-center" type="submit" disabled={isProgress}>
            {isProgress ? <span className="spinner-border" role="status" aria-hidden="true"></span> : 'Sign in'}
          </button>
          <p className="mt-5 mb-3 text-muted small">Are you new here? <Link to='/register' >Create Account</Link></p>
        </form>
      </div>
    </div>
  )
}
