import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Context from '../../context'
import { mealMenuUnreg, regular_service } from '../serviceMenu'


function ViewOrder() {
    const location = useLocation()
    const navigate = useNavigate()
    const order = location?.state
    const context = useContext(Context)
    const [isloaded, setIsLoaded] = useState(0)

    useEffect(() => {
        context.setLoaderProgress(40)
        if (order && order.order_id) {  
            setIsLoaded(1)
        }else{
            navigate("/")
        }
        context.setLoaderProgress(100)
        // eslint-disable-next-line
    }, [])

    return (
        isloaded === 1 &&
        <>
            <div className="page-header border-bottom py-3 d-print-none">
                <div className="hstack">
                    <h3 className='text-dark'># Meal Order {order.order_id}</h3>
                    <div className="ms-auto"><Link to={'/order'} className='btn btn-secondary'><FontAwesomeIcon icon={faArrowLeft} className='me-2'></FontAwesomeIcon>Go Back</Link></div>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-6">
                    <div className="vstack">
                        <h5 className='mb-3'><strong>Customer: </strong> &nbsp;{order.customer}</h5>
                        <h5 className='mb-3'><strong>Order type: </strong> &nbsp;{(mealMenuUnreg[order.order_type])?.name || (regular_service[order.order_type])?.name}</h5>
                        <h5 className='mb-3'><strong>Payment method: </strong> &nbsp;{order.payment_method.toUpperCase()}</h5>
                        <h5 className='mb-3'><strong>Service date: </strong> &nbsp;{new Date(order.service_date).toLocaleDateString('en-GB')}</h5>
                        <h5 className='mb-3'><strong>Txn amount: </strong> &nbsp;₹ {order.txn_amount}</h5>
                        <h5 className='mb-3'><strong>Txn id: </strong> &nbsp;{order.txn_id}</h5>
                        <button type='button' className='btn btn-secondary w-25 mt-3 d-print-none' onClick={() => window.print()}>Print Receipt</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewOrder