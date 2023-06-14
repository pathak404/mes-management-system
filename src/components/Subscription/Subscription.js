import { faArrowRight, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../../api'
import Context from '../../context'
import { regular_service } from '../serviceMenu'
import qr from '../../assets/images/qr.jpeg'



function Subscription() {
    const { student_id } = useParams()
    const context = useContext(Context)
    const [isProgress, setIsProgress] = useState(false)
    const [isUPI, setIsUPI] = useState(false)
    const [student, setStudent] = useState({
        student_id: student_id ?? "",
        txn_type: 'subscription',
        txn_status: 'success',
        payment_method: "",
        txn_amount: '',
        meal_type: '',
        validity: '',
        txn_desc: ''
    })
    const validity_string = useRef("")


    const inputChange = (e) => {
        let updated = { [e.target.id]: e.target.value }
        if (e.target.id === "validity") {
            if (e.target.value === "s_10") {
                validity_string.current = `For +10 days`
            }
            else if (e.target.value === "s_20") {
                validity_string.current = `For +20 days`
            }
            else if (e.target.value === "s_30") {
                validity_string.current = `For +30 days`
            }
            setStudent((prev) => ({ ...prev, ...updated, txn_amount: (regular_service[student.meal_type])[e.target.value], txn_desc: validity_string.current }))
        } else {
            setStudent((prev) => ({ ...prev, ...updated }))
        }

        if (e.target.id === "payment_method" && e.target.value === "upi") {
            setIsUPI(true)
        } else if (e.target.id === "payment_method" && e.target.value !== "upi") {
            setIsUPI(false)
        }
    }





    const formHandler = (e) => {
        e.preventDefault()
        // verify
        if (!student.student_id) {
            context.setToastData({ type: 'error', message: "Please enter Student ID" })
            return;
        }
        // options
        if (!student.meal_type) {
            setIsProgress(true)
            API.get('/student', { params: { student_id: student.student_id } }).then((response) => {
                const res = response.data
                if (res.status) {
                    setStudent((prev) => ({ ...prev, ...res.data }))
                }
            }).finally(() => setIsProgress(false))
            return;
        }
        // add
        setIsProgress(true)
        API.post('/transaction', student).then((response) => {
            const res = response.data
            if (res.status) {
                context.setToastData({ type: 'success', message: res.data.message?.toString() })
                setStudent((prev) => ({ ...prev, student_id: '', meal_type: '', validity: '', txn_amount: '' }))
            }
        }).finally(() => setIsProgress(false))
    }







    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># Subscription {student_id}</h3>
                </div>
            </div>

            <div className="row mx-1 mt-4">
                <div className="col-5 col-xl-4">
                    <form onSubmit={formHandler}>
                        <div className="row">
                            <div className="col-11 mb-3">
                                <label htmlFor="student_id" className="form-label">Student ID</label>
                                <input type="text" className="form-control shadow-none bg-white border-2" id="student_id" value={student.student_id} onChange={inputChange} placeholder="Enter Student ID." disabled={student.student_id && student.meal_type} />
                            </div>
                            {student.meal_type &&
                                <>
                                    <div className="col-11 mb-3">
                                        <label htmlFor="validity" className="form-label">Plan Validity</label>
                                        <select className="form-select shadow-none bg-white border-2" id='validity' value={student.validity} onChange={inputChange}>
                                            <option value='' disabled>Select Plan</option>
                                            <option value="s_10">10 Days</option>
                                            <option value="s_20">20 Days</option>
                                            <option value="s_30">30 Days</option>
                                        </select>
                                    </div>

                                    <div className="col-11 mb-3">
                                        <label htmlFor="payment_method" className="form-label">Payment Method</label>
                                        <select className="form-select shadow-none bg-white border-2" id='payment_method' value={student.payment_method} onChange={inputChange}>
                                            <option value='' disabled>Select Payment Method</option>
                                            <option value="cash">Cash</option>
                                            <option value="upi">UPI</option>
                                        </select>
                                    </div>
                                    <div className="col-12 mb-3">
                                        {(regular_service[student.meal_type])[student.validity] && <div className="my-3">
                                            <h4 className='text-dark'><span className="small">₹ </span>{(regular_service[student.meal_type])[student.validity]}</h4>
                                        </div>}
                                    </div>
                                    {!isUPI || <div className="col-9 col-xl-7 mb-3">
                                        <img src={qr} className="w-100 mt-1 mb-4" alt='payment qr code' />
                                    </div>}
                                </>}
                        </div>

                        <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center ms-1 gap-2 mb-5" type="submit" disabled={isProgress}>
                            {isProgress && <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                            {!student.meal_type ? 'Fetch Data' : 'Add subscription'}
                            {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
                        </button>

                    </form>
                </div>
                <div className="col-7 col-xl-5">
                    {student.meal_type && <div className="card border-0 shadow bg-white p-4 p-xl-5">
                        <div className='hstack gap-3 mb-4'>
                            <FontAwesomeIcon icon={faUserCircle} size="4x" className='text-dark' />
                            <div>
                                <h5 className='pt-2 text-dark'>{student.full_name}</h5>
                                <p>+91 {student.phone}</p>
                            </div>
                        </div>
                        <div>
                            <p className='mb-1'><strong>Father's Name:</strong>&nbsp; {student.father_name}</p>
                            <p className='mb-1'><strong>Meal Type:</strong>&nbsp; {regular_service[student.meal_type].name}</p>
                            <p className='mb-1'><strong>Branch:</strong>&nbsp; {student.branch}</p>
                            <p className='mb-1'><strong>Year:</strong>&nbsp; {student.year}</p>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Subscription