import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useContext } from 'react'
import Context from '../../context'
import { API } from '../../api'
import NoData from '../blocks/NoData'
import Table from '../blocks/Table'
import TableSkelton from '../blocks/TableSkelton'

function Attendance() {
    const context = useContext(Context)
    const [isProgress, setIsProgress] = useState(false)
    const [student, setStudent] = useState({
        student_id: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    })
    const [isloaded, setIsLoaded] = useState(0)
    const [attendance, setAttendance] = useState([])

    const columns = { date: "Date", student_id: "Student ID", amount: "Amount", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" }

    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    }

    const years = () => {
        let current = new Date().getFullYear()
        return [current, (current - 1), (current - 2)]
    }

    const inputChange = (e) => {
        let updated = { [e.target.id]: e.target.value }
        setStudent((prev) => ({ ...prev, ...updated }))
    }

    const studentIDFormHandler = (e) => {
        e.preventDefault()

        if (!student.student_id) {
            context.setToastData({ type: 'error', message: "Please enter Student ID" })
            return;
        }

        setIsProgress(true)
        API.get('/attendance', { params: student }).then((response) => {
            let result = response.data
            if (result.status === 1) {
                // success
                setTimeout(() => {
                    setAttendance(result.data)
                    setIsLoaded(true)
                    setIsProgress(false)
                }, 700)
            } else {
                // error
                setIsProgress(false)
            }
            console.log(result)
        })
    }


    const filterTable = (e) => {
        const newData = attendance.filter((single) => {
            return single.date.toString().includes(e.target.value)
        })
        return newData
    }

    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># Attendance</h3>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-6 col-xl-4 ms-2">
                    <form onSubmit={studentIDFormHandler} className="w-100">
                        <div className="mb-3">
                            <label htmlFor="student_id" className="form-label">Student ID</label>
                            <input type="text" className="form-control shadow-none bg-white border-2" id="student_id" placeholder="Enter Student ID." value={student.student_id} onChange={inputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="month" className="form-label">Month</label>
                            <select className="form-select shadow-none bg-white border-2" id='month' value={student.month} onChange={inputChange}>
                                {Object.keys(months).map(key => <option value={key} key={key}>{months[key]}</option>)}
                            </select>

                        </div>
                        <div className="mb-3">
                            <label htmlFor="year" className="form-label">Year</label>
                            <select className="form-select shadow-none bg-white border-2" id='year' value={student.year} onChange={inputChange}>
                                {years().map(year => <option value={year} key={year}>{year}</option>)}
                            </select>
                        </div>

                        <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center gap-2" type="submit" disabled={isProgress}>
                            {isProgress && <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                            {isProgress ? 'Please Wait ...' : 'Fetch Attendance'}
                            {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
                        </button>
                    </form>
                </div>

                <div className="col-12 mt-4">
                    {!isProgress && isloaded && !attendance.length ? <NoData /> : ''}
                    {isProgress && <TableSkelton header cols={6} rows={5} />}
                    {isloaded && attendance.length ? <Table data={attendance} columns={columns} filterTable={filterTable} /> : ''}
                </div>
            </div>
        </>
    )
}

export default Attendance