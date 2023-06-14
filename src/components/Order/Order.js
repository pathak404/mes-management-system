import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../../api'
import { mealMenuUnreg } from '../serviceMenu'
import qr from '../../assets/images/qr.jpeg'
import routine from '../../assets/images/routine.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function Order() {
    const navigate = useNavigate()
    const [tab, setTab] = useState(1)
    const [isUPI, setIsUPI] = useState(false)
    const [isProgress, setIsProgress] = useState(false)

    const orderTypeByTime = () => {
        let order_type = ''
        let hours = new Date().getHours()
        if (hours >= 6 && hours <= 12) {
            order_type = "breakfast"
        } else if (hours > 12 && hours <= 18) {
            order_type = "lunch"
        } else if (hours > 18 && hours <= 23) {
            order_type = "dinner"
        }
        return order_type
    }

    const [regular, setRegular] = useState({
        payment_method: 'wallet',
        customer: 'regular',
        student_id: '',
        order_type: orderTypeByTime()
    })
    const [unregular, setUnregular] = useState({
        payment_method: '',
        customer: '',
        order_type: ''
    })

    const changeTab = (num) => {
        if (!isProgress) {
            setTab(num)
        }
    }
    const setRegularInput = (e) => {
        let updated = { [e.target.id]: e.target.value }
        setRegular((prev) => ({ ...prev, ...updated }))
    }

    const setUnregularInput = (e) => {
        let updated = { [e.target.id]: e.target.value }
        setUnregular((prev) => ({ ...prev, ...updated }))

        if (e.target.id === "payment_method" && e.target.value === "upi") {
            setIsUPI(true)
        } else if (e.target.id === "payment_method" && e.target.value !== "upi") {
            setIsUPI(false)
        }
    }

    const formHandler = (e) => {
        e.preventDefault()
        setIsProgress(true)
        let data = tab === 1 ? regular : unregular
        API.post('/order', data).then((response) => {
            let result = response.data
            if (result.status === 1) {
                // success
                navigate('/order/receipt', { state: { ...result.data } })
            }
        }).finally(() => setIsProgress(false))
    }

    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># Meal Order</h3>
                </div>
            </div>
            <div className="row mx-1 mt-4 gap-0">
                <div className="col-7 col-xl-4">
                    <div className="d-flex justify-content-evenly rounded-3" style={{ backgroundColor: 'var(--bs-gray-200)' }}>
                        <div id="regular" className={`py-1 px-3 m-2 text-center w-50 rounded-2 ${tab === 1 && 'bg-white shadow-sm'}`} style={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => changeTab(1)}>
                            Regular Order
                        </div>
                        <div id="unregular" className={`py-1 px-3 m-2 text-center w-50 rounded-2 ${tab === 2 && 'bg-white shadow-sm'}`} style={{ userSelect: 'none', cursor: 'pointer' }} onClick={() => changeTab(2)}>
                            Unregular Order
                        </div>
                    </div>

                    <div className="mt-3">
                        <form className={tab === 1 ? 'd-block' : 'd-none'} onSubmit={formHandler}>
                            <div className="mb-3">
                                <label htmlFor="order_type" className="form-label">Meal Type</label>
                                <select className="form-select shadow-none bg-white border-2" id='order_type' value={regular.order_type} onChange={setRegularInput}>
                                    <option value='' disabled>Select Meal Type</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="student_id" className="form-label">Student ID</label>
                                <input type="text" className="form-control shadow-none bg-white border-2" id="student_id" value={regular.student_id} onChange={setRegularInput} placeholder="Enter Student ID" />
                            </div>
                            <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center ms-1 gap-2 mb-5" type="submit" disabled={isProgress}>
                                {!isProgress || <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                                Create Order
                                {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
                            </button>
                        </form>

                        {/* unregular */}
                        <form className={tab === 2 ? 'd-block' : 'd-none'} onSubmit={formHandler}>
                            <div className="mb-3">
                                <label htmlFor="order_type" className="form-label">Meal Type</label>
                                <select className="form-select shadow-none bg-white border-2" id='order_type' value={unregular.order_type} onChange={setUnregularInput}>
                                    <option value='' disabled>Select Meal Type</option>
                                    {Object.keys(mealMenuUnreg).map((key) => {
                                        return <option value={key} key={key}>{(mealMenuUnreg[key]).name}</option>
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="customer" className="form-label">Phone No.</label>
                                <input type="text" className="form-control shadow-none bg-white border-2" id="customer" value={unregular.customer} onChange={setUnregularInput} placeholder="Enter Phone No." />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="payment_method " className="form-label">Payment Method</label>
                                <select className="form-select shadow-none bg-white border-2" id='payment_method' value={unregular.payment_method} onChange={setUnregularInput}>
                                    <option value='' disabled>Select Payment Methed</option>
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                </select>
                            </div>

                            {(mealMenuUnreg[unregular.order_type]) && <div className="my-4">
                                <h4 className='text-dark'><span className="small">₹ </span>{(mealMenuUnreg[unregular.order_type])?.amount}</h4>
                            </div>}

                            {!isUPI || <img src={qr} className="w-50 mt-1 mb-4" alt='payment qr code' />}

                            <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center ms-1 gap-2 mb-5" type="submit" disabled={isProgress}>
                                {!isProgress || <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                                Create Order
                                {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-12 col-xl-7 mt-3 pt-3 mt-xl-0 pt-xl-0">
                    <img src={routine} className="w-100 mb-4 ms-2" alt='weekly routine' />
                </div>
            </div>
        </>
    )
}

export default Order