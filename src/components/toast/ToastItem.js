import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faInfo, faExclamation } from '@fortawesome/free-solid-svg-icons'

function ToastItem({data}) {

    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (data.type) {
            setStatus(true)
            setTimeout(() => {
                setStatus(false)
            }, 5000)
        }
    }, [data])

    const iconMap = {
        "success": faCheck,
        "danger": faXmark,
        "info": faInfo,
        "warning": faExclamation
    }
    const toastType = data.type && data.type === "error" ? "danger" : data.type


    return (
         status && <div className={`toast show bg-${toastType} border-0 text-white`} style={{ boxShadow: `0 0.7rem 1rem rgba(var(--bs-${toastType}-rgb), 0.22)` }} role="alert" data-animation="true" data-autohide="true" aria-live="assertive" aria-atomic="true">
            <div className="toast-body d-flex align-items-center justify-content-between">
                <div style={{ width: '8%' }}>
                    <span className="bg-light-2 py-1 rounded" style={{ paddingInline: '0.6rem', scale: '1.3' }}><FontAwesomeIcon icon={iconMap[toastType]} /></span>
                </div>
                <div style={{ width: '70%' }}>
                    <p className='text-left mb-0'>{data.message}</p>
                </div>

                <div style={{ width: '8%' }}>
                    <button style={{ width: '0.5em', height: '0.5em', float: 'right', boxShadow: 'none' }} onClick={() => setStatus(false)} type="button" className="btn-close ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}

export default ToastItem