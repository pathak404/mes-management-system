import React, { useEffect, useState, useContext } from 'react'
import { API } from '../../api'
import Context from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Modal from '../Modal/Modal'


function Account() {
    const context = useContext(Context)
    const [account, setAccount] = useState({ ...JSON.parse(localStorage.getItem("account")), password: '' })
    const [isloaded, setIsLoaded] = useState(0)
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        context.setLoaderProgress(40)
        if (!account.length) {
            API.get('/admin').then((response) => {
                const res = response.data
                if (res.status) {
                    setAccount({ ...res.data, password: '' })
                    setIsLoaded(1)
                }
                context.setLoaderProgress(100)
            })
        } else {
            context.setLoaderProgress(100)
        }
        // eslint-disable-next-line
    }, [])

    const [isProgress, setIsProgress] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const inputChange = (e) => {
        let updated = { [e.target.id]: e.target.value }
        setAccount((prev) => ({ ...prev, ...updated }))
    }

    const formSumbit = () => {
        setIsEdit(false)
        setIsProgress(true)
        API.put('/admin', account).then((response) => {
            const res = response.data
            if (res.status) {
                context.setToastData({ type: 'success', message: "Account details updated Successfully" })
            }
        }).finally(() => setIsProgress(false))
    }

    const updateAccount = (e) => {
        e.preventDefault()
        if (!isEdit) {
            setModalData({
                heading: 'Enter Keypharse to continue',
                message: 'Keypharse is required to perform this action.',
                allowText: "Edit Account",
                disallowText: "Cancel",
                onAllow: (keyphrase) => {
                    if (keyphrase === process.env.REACT_APP_KEYPHRASE) {
                        setIsEdit(true)
                        return;
                    }
                    context.setToastData({ type: 'error', message: "Wrong keypharse entered" })
                }
            })
        }else{
            formSumbit()
        }
    }

    return (
        <>
            {!isloaded || <>
                <Modal data={modalData} setModalData={setModalData} />
                <div className="page-header border-bottom py-3">
                    <div className="hstack">
                        <h3 className='text-dark'># Account</h3>
                    </div>
                </div>
                {/* account */}
                <div className="row gap-5 mx-2">
                    <div className="col-10 col-xl-7">
                        <form className='mt-4' onSubmit={updateAccount}>

                            <div className="row mb-4">
                                <div className="col-6">
                                    <label htmlFor="full_name" className="form-label">Full name</label>
                                    <input type="text" className="form-control shadow-none bg-white border-2" id="full_name" placeholder="Full name" value={account.full_name} onChange={inputChange} disabled={!isEdit} />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control shadow-none bg-white border-2" id="email" placeholder="Email address" value={account.email} onChange={inputChange} disabled={!isEdit} />
                                </div>
                            </div>


                            <div className="row mb-4">
                                <div className="col-6">
                                    <label htmlFor="phone" className="form-label">Phone no.</label>
                                    <input type="tel" className="form-control shadow-none bg-white border-2" id="phone" placeholder="Phone no." value={account.phone} onChange={inputChange} disabled={!isEdit} />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="text" className="form-control shadow-none bg-white border-2" id="password" placeholder="Password" value={account.password} onChange={inputChange} disabled={!isEdit} />
                                </div>
                            </div>

                            <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center ms-1 gap-2" type="submit" disabled={isProgress}>
                                {isProgress && <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                                {isEdit ? 'Save changes' : 'Edit details'}
                                {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
                            </button>
                        </form>
                    </div>
                </div>
            </>}
        </>
    )
}

export default Account