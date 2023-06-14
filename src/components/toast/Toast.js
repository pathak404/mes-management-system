import React, { useEffect, useState } from 'react'
import ToastItem from './ToastItem'

function Toast(props) {

    const [toastList, setToastList] = useState(props.data)

    useEffect(() => {
        setToastList([...props.data])
    }, [props.data])

    return (
        <div className="toast-container position-fixed top-0 end-0 p-4">
            {toastList.map((data, i) => <ToastItem data={data} key={i} />)}
        </div>
    )
}

export default Toast