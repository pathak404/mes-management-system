import React, { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import Context from './context'
import { API } from './api'

import Login from './public/auth/Login'
import Register from './public/auth/Register'

import ProtectedPage from './controllers/ProtectedPage'
import PublicPage from './controllers/PublicPage'

import Home from './components/Home'
import Toast from './components/toast/Toast'

import Students from './components/Students/Students'
import ViewStudent from './components/Students/ViewStudent'
import NewStudent from './components/Students/NewStudent'

import Order from './components/Order/Order'
import ViewOrder from './components/Order/ViewOrder'
import Subscription from './components/Subscription/Subscription'
import Transactions from './components/Transactions/Transactions'
import Attendance from './components/Attendance/Attendance'
import Account from './components/Account/Account'


function App() {
  const [islogged, setIslogged] = useState(localStorage.getItem('JWT'))
  API.defaults.headers.common['Authorization'] = 'Bearer ' + islogged
  const [loaderProgress, setLoaderProgress] = useState(0)
  const [toastDataList, setToastDataList] = useState([])

  useEffect(() => {
    API.interceptors.response.use(
      async (response) => {
        let res = response.data
        res.data === undefined && setToastData({ type: 'error', message: "Error occurrence on server side" })
        res.data?.hasOwnProperty('message') && res.data.message[0].includes('jwt') && logout()
        if (res.status === 1 && res.jwt) {
          localStorage.setItem("JWT", res.jwt)
          API.defaults.headers.common['Authorization'] = 'Bearer ' + res.jwt
        }
        if (res.status === 0) {
          Object.keys(res.data).forEach((key) => {
            setToastData({ type: 'error', message: res.data[key].toString() })
          })
        }
        return response
      },
      async (error) => {
        if (error.response) {
          setToastData({ type: 'error', message: error.response.status + " " + error.response.data })
        } else {
          setToastData({ type: 'error', message: "Unable to communicate with the server" })
        }
        return Promise.reject(error)
      })
  }, [])

  // const demo = () => console.log("allowed")

  const logout = () => {
    localStorage.removeItem('JWT')
    localStorage.removeItem('account')
    setIslogged(false)
  }

  const signIn = (account, JWT) => {
    setIslogged(JWT)
    localStorage.setItem('JWT', JWT)
    localStorage.setItem('account', account)
  }

  // OBJ {type, message}
  const setToastData = (data) => setToastDataList((prevData) => [...prevData, data])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          index
          path='/'
          element={<ProtectedPage element={<Home />} />}
        />

        <Route
          path='/students'
          element={<ProtectedPage element={<Students />} />}
        />
        <Route
          path='/students/new'
          element={<ProtectedPage element={<NewStudent />} />}
        />
        <Route
          path='/students/:student_id'
          element={<ProtectedPage element={<ViewStudent />} />}
        />

        <Route
          path='/order'
          element={<ProtectedPage element={<Order />} />}
        />
        <Route
          path='/order/receipt'
          element={<ProtectedPage element={<ViewOrder />} />}
        />

        <Route
          path='/subscription'
          element={<ProtectedPage element={<Subscription />} />}
        />
        <Route
          path='/subscription/:student_id'
          element={<ProtectedPage element={<Subscription />} />}
        />

        <Route
          path='/transactions'
          element={<ProtectedPage element={<Transactions />} />}
        />
        <Route
          path='/transactions/:customer'
          element={<ProtectedPage element={<Transactions />} />}
        />

        <Route
          path='/attendance'
          element={<ProtectedPage element={<Attendance />} />}
        />

        <Route
          path='/account'
          element={<ProtectedPage element={<Account />} />}
        />

        <Route
          path='/login'
          element={<PublicPage redirect noHeader element={<Login signIn={signIn} />} />}
        />
        <Route
          path='/register'
          element={<PublicPage redirect noHeader element={<Register signIn={signIn} />} />}
        />

      </>
    )
  )

  return (
    <Context.Provider value={{ islogged, logout, setLoaderProgress, setToastData }} >
      <LoadingBar height={3} color='rgb(40, 180, 133)' progress={loaderProgress} onLoaderFinished={() => setLoaderProgress(0)} />
      <Toast key="mainToast" data={toastDataList} />
      <RouterProvider router={router} />
    </Context.Provider>
  );
}

export default App;
