import { faArrowRightArrowLeft, faPlateWheat, faUsers, faMugSaucer, faBowlRice, faBowlFood } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useContext, useState } from 'react'
import Context from '../context'
import { API } from '../api'
import axios from 'axios'
import { mealMenuUnreg, regular_service } from './serviceMenu'
import Table from './blocks/Table'

export default function Home() {

  const context = useContext(Context)
  const [orders, setOrders] = useState([])
  const [txns, setTxns] = useState([])
  const [statistics, setStatistics] = useState({})
  const [isloaded, setIsLoaded] = useState(false)


  const txnColumns = { txn_id: "Txn ID", txn_type: "Txn Type", txn_amount: "Amount" }
  const orderColumns = { customer: "Customer", order_type: "Order Type", txn_amount: "Amount" }

  useEffect(() => {
    context.setLoaderProgress(50)

    axios.all([
      API.get('/statistics'),
      API.get('/order_all', { params: { limit: 5 } }),
      API.get('/transaction_all', { params: { limit: 5 } }),
    ])
      .then(axios.spread((response1, response2, response3) => {
        const res1 = response1.data
        if (res1.status) {
          console.log(res1)
          setStatistics(res1.data)
        }

        const res2 = response2.data
        if (res2.status) {
          let data = []
          Object.keys(res2.data).forEach(i => {
            res2.data[i].order_type = (regular_service[res2.data[i].order_type])?.name ?? (mealMenuUnreg[res2.data[i].order_type])?.name
            data.push(res2.data[i])
          })
          setOrders(data)
        }

        const res3 = response3.data
        if (res3.status) {
          setTxns(res3.data)
        }

        context.setLoaderProgress(100)
        setIsLoaded(true)
      }))
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <div className="page-header p-3">
        <div className="hstack">
          <h3 className='text-dark'>Dashboard</h3>
        </div>
      </div>

      {/* all */}
      <div className="m-3">
      <h4 className='pb-3'># Overroll</h4>
        <div className="hstack gap-4">

          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faUsers} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Students</p>
            <h4 className='text-black'>{statistics?.all?.students}</h4>
          </div>

          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faArrowRightArrowLeft} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Transactions</p>
            <h4 className='text-black'>{statistics?.all?.transactions}</h4>
          </div>

          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faPlateWheat} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Meal Served</p>
            <h4 className='text-black'>{statistics?.all?.meal_served}</h4>
          </div>

        </div>
      </div>

      {/* today */}
      <div className="m-3">
        <h4 className='py-3'># Today's Statistics</h4>
        <div className="hstack gap-4">

          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faUsers} size='2x' className='text-black' />
            <p className='my-3 fs-5'>New Students</p>
            <h4 className='text-black'>{statistics?.today?.students}</h4>
          </div>

          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faArrowRightArrowLeft} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Transactions</p>
            <h4 className='text-black'>{statistics?.today?.transactions}</h4>
          </div>
        </div>
      </div>

      <div className="m-3">
      <h4 className='py-3'># Serves Remaining</h4>
        <div className="hstack gap-4">
          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faMugSaucer} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Breakfast</p>
            <h4 className='text-black'>{statistics?.today?.meal_served?.breakfast}</h4>
          </div>
          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faBowlRice} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Lunch</p>
            <h4 className='text-black'>{statistics?.today?.meal_served?.lunch}</h4>
          </div>
          <div className="card border-0 shadow bg-white rounded-4 align-items-start p-4" style={{ width: '200px', height: '170px' }}>
            <FontAwesomeIcon icon={faBowlFood} size='2x' className='text-black' />
            <p className='my-3 fs-5'>Dinner</p>
            <h4 className='text-black'>{statistics?.today?.meal_served?.dinner}</h4>
          </div>

        </div>
      </div>




      <div className="row mt-5 pt-4">
        {isloaded && <div className="col-12 col-xl-7">
          <h5 className='ms-2 py-2'> Last 5 Transactions </h5>
          <Table data={txns} columns={txnColumns} />
        </div>}
        {isloaded && <div className="col-12 col-xl-5">
          <h5 className='ms-2 mt-5 mt-xl-0 py-2'> Last 5 Meal Orders </h5>
          <Table data={orders} columns={orderColumns} />
        </div>}
      </div>
    </>
  )
}
