import React, { useContext, useState } from 'react'
import Context from '../../context'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../../api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

function NewStudent() {
    const context = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        context.setLoaderProgress(100)
        // eslint-disable-next-line
    }, [])

    const [student, setStudent] = useState({
        phone: '',
        full_name: '',
        branch: '',
        father_name: '',
        year: '',
        meal_type: ''
    })
    const [isProgress, setIsProgress] = useState(false)

    const inputChange = (e) => {
        let updated = { [e.target.id]: e.target.value }
        setStudent((prev) => ({ ...prev, ...updated }))
    }


    const years = () => {
        let start = 2020;
        let end = new Date().getFullYear()
        let years = []
        for (let i = start; i <= end; i++) {
            years.push(start)
            start++;
        }
        return years.reverse()
    }

    const formSumbit = (e) => {
        e.preventDefault()
        setIsProgress(true)
        if (student.phone.length !== 10 || isNaN(student.phone)) {
            context.setToastData({ type: 'error', message: "10 digit phone number is required" })
            setIsProgress(false)
            return;
        } else if (student.meal_type.length === 0) {
            context.setToastData({ type: 'error', message: "Please select meal type" })
            setIsProgress(false)
            return;
        }

        API.post('/student', student).then((response) => {
            let result = response.data
            if (result.status === 1) {
                // success
                context.setToastData({ type: 'success', message: "New student added successfully" })
                navigate(-1)
            }
        }).finally(() => setIsProgress(false))
    }

    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># Add Student</h3>
                    <div className="ms-auto"><Link to={'/students'} className='btn btn-secondary'><FontAwesomeIcon icon={faArrowLeft} className='me-2'></FontAwesomeIcon>Go Back</Link></div>
                </div>
            </div>

            <form className='mt-4 mx-2' onSubmit={formSumbit}>
                <div className="row mb-4">
                    <div className="col-4">
                        <label htmlFor="full_name" className="form-label">Student name</label>
                        <input type="text" className="form-control shadow-none bg-white border-2" id="full_name" placeholder="Student Name" value={student.full_name} onChange={inputChange} />
                    </div>

                    <div className="col-4">
                        <label htmlFor="father_name" className="form-label">Father's name</label>
                        <input type="text" className="form-control shadow-none bg-white border-2" id="father_name" placeholder="Father's name" value={student.father_name} onChange={inputChange} />
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-4">
                        <label htmlFor="phone" className="form-label">Student phone no.</label>
                        <input type="tel" className="form-control shadow-none bg-white border-2" id="phone" placeholder="Student phone no." value={student.phone} onChange={inputChange} />
                    </div>

                    <div className="col-4">
                        <label htmlFor="branch" className="form-label">Branch</label>
                        <select className="form-select shadow-none bg-white border-2" id='branch' value={student.branch} onChange={inputChange}>
                            <option value='' disabled>Select branch</option>
                            <option value="CSE">CSE</option>
                            <option value="CIVIL">CIVIL</option>
                            <option value="MECHANICAL">MECHANICAL</option>
                            <option value="EEE">EEE</option>
                            <option value="OTHERS">OTHERS</option>
                        </select>
                    </div>
                    <div className="col-4"></div>

                    <div className="col-4">
                        <label htmlFor="year" className="form-label mt-4">Year</label>
                        <select className="form-select shadow-none bg-white border-2" id='year' value={student.year} onChange={inputChange}>
                            <option value='' disabled>Select year</option>
                            {years().map(year => <option value={year} key={year}>{year}</option>)}
                        </select>
                    </div>

                    <div className="col-4">
                        <label htmlFor="meal_type" className="form-label mt-4">Meal Type</label>
                        <select className="form-select shadow-none bg-white border-2" id='meal_type' value={student.meal_type} onChange={inputChange}>
                            <option value='' disabled>Select meal type</option>
                            <option value="ALL">Breakfast + Lunch + Dinner</option>
                            <option value="BL">Breakfast + Lunch</option>
                            <option value="BD">Breakfast + Dinner</option>
                            <option value="LD">Lunch + Dinner</option>
                        </select>
                    </div>
                </div>



                <button className="w-auto btn btn-primary d-flex justify-content-center ms-1" type="submit" disabled={isProgress}>
                    {isProgress ? <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span> : 'Add Student'}
                </button>


            </form>

        </>
    )
}

export default NewStudent