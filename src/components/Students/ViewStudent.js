import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API } from '../../api'
import Context from '../../context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import NoData from '../blocks/NoData'
import Modal from '../Modal/Modal'



function ViewStudent() {
  const { student_id } = useParams()
  const context = useContext(Context)
  const navigate = useNavigate()
  const [isloaded, setIsLoaded] = useState(0)
  const [modalData, setModalData] = useState({})

  const [student, setStudent] = useState({
    phone: '',
    full_name: '',
    branch: '',
    father_name: '',
    year: '',
    meal_type: ''
  })

  useEffect(() => {
    context.setLoaderProgress(40)
    API.get('/student', { params: { student_id: student_id } }).then((response) => {
      const res = response.data
      if (!res.status) {
        setIsLoaded(2)
      } else {
        setStudent(res.data)
        setIsLoaded(1)
      }
      context.setLoaderProgress(100)
    })
    // eslint-disable-next-line
  }, [])

  const [isProgress, setIsProgress] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

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

  const countDays = (start, end) => {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    return Math.floor((end - start) / _MS_PER_DAY) + 1
  }

  const formSumbit = (e) => {
    e.preventDefault()
    if (!isEdit) {
      setIsEdit(true)
      return;
    }
    setIsEdit(false)
    setIsProgress(true)
    API.put('/student', student).then((response) => {
      const res = response.data
      if (res.status) {
        context.setToastData({ type: 'success', message: res.data.message })
      }
    }).finally(() => setIsProgress(false))
  }

  const deleteHandler = () => {
    setModalData({
      heading: 'Do you want to delete this student',
      message: 'Student data, orders, transactions, wallet of this student will be delete',
      allowText: "Delete",
      disallowText: "Cancel",
      onAllow: (keyphrase) => {
        if(keyphrase === process.env.REACT_APP_KEYPHRASE){
          deleteStudent()
          return;
        }
        context.setToastData({ type: 'error', message: "Wrong secrect entered" })
      }
    })
  }

  const deleteStudent = () => {
    API.delete('/student', {data: {student_id: student_id}}).then((response) => {
      const res = response.data
      if (res.status) {
        context.setToastData({ type: 'success', message: res.data.message })
        navigate("/students")
      }
    })
  }

  return (
    <>
      {isloaded === 2 && <NoData />}
      {isloaded === 1 && <>
        <Modal data={modalData} setModalData={setModalData} />
        <div className="page-header border-bottom py-3">
          <div className="hstack">
            <h3 className='text-dark'># Student {student_id}</h3>
            <div className="ms-auto d-flex gap-4">
              <Link to={'/students'} className='btn btn-secondary'><FontAwesomeIcon icon={faArrowLeft} className='me-2'></FontAwesomeIcon>Go Back</Link>
              <button className='btn btn-danger' onClick={deleteHandler}><FontAwesomeIcon icon={faTrash} className='me-2'></FontAwesomeIcon>Delete Student</button>
            </div>
          </div>
        </div>
        {/* account */}
        <div className="row mx-2">
          <div className="col-12 col-xl-6">
            <div className="mt-4">
              <h5>1. Account Details</h5>
            </div>
            <form className='mt-4' onSubmit={formSumbit}>

              <div className="row mb-4">
                <div className="col-6">
                  <label htmlFor="full_name" className="form-label">Student name</label>
                  <input type="text" className="form-control shadow-none bg-white border-2" id="full_name" placeholder="Student Name" value={student.full_name} onChange={inputChange} disabled={!isEdit} />
                </div>

                <div className="col-6">
                  <label htmlFor="father_name" className="form-label">Father's name</label>
                  <input type="text" className="form-control shadow-none bg-white border-2" id="father_name" placeholder="Father's name" value={student.father_name} onChange={inputChange} disabled={!isEdit} />
                </div>
              </div>


              <div className="row mb-4">
                <div className="col-6">
                  <label htmlFor="phone" className="form-label">Student phone no.</label>
                  <input type="tel" className="form-control shadow-none bg-white border-2" id="phone" placeholder="Student phone no." value={student.phone} onChange={inputChange} disabled={!isEdit} />
                </div>

                <div className="col-6">
                  <label htmlFor="branch" className="form-label">Branch</label>
                  <select className="form-select shadow-none bg-white border-2" id='branch' value={student.branch} onChange={inputChange} disabled={!isEdit}>
                    <option value='' disabled>Select branch</option>
                    <option value="CSE">CSE</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                    <option value="EEE">EEE</option>
                    <option value="OTHERS">OTHERS</option>
                  </select>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-6">
                  <label htmlFor="year" className="form-label">Year</label>
                  <select className="form-select shadow-none bg-white border-2" id='year' value={student.year} onChange={inputChange} disabled={!isEdit}>
                    <option value='' disabled>Select year</option>
                    {years().map(year => <option value={year} key={year}>{year}</option>)}
                  </select>
                </div>

                <div className="col-6">
                  <label htmlFor="meal_type" className="form-label">Meal Type</label>
                  <select className="form-select shadow-none bg-white border-2" id='meal_type' value={student.meal_type} onChange={inputChange} disabled={!isEdit}>
                    <option value='' disabled>Select meal type</option>
                    <option value="ALL">Breakfast + Lunch + Dinner</option>
                    <option value="BL">Breakfast + Lunch</option>
                    <option value="BD">Breakfast + Dinner</option>
                    <option value="LD">Lunch + Dinner</option>
                  </select>
                </div>
              </div>

              <button className="w-auto btn btn-primary d-flex justify-content-center align-items-center ms-1 gap-2" type="submit" disabled={isProgress}>
                {isProgress && <span className="spinner-border spinner-border-sm" style={{ width: '24px', height: '24px' }} role="status" aria-hidden="true"></span>}
                {isEdit ? 'Save changes' : 'Edit student'}
                {!isProgress && <FontAwesomeIcon icon={faArrowRight} />}
              </button>
            </form>
          </div>

          {/* wallet */}

          <div className="col-8 col-xl-5 my-5 mt-xl-0 ps-xl-5">
            <div className="mt-4">
              <h5>2. Wallet Details</h5>
            </div>

            <div className="row mt-4">
              <div className="col-4">
                <p>Wallet Balance</p>
                <h3><span className="small">₹</span>{student.balance}</h3>
              </div>
              <div className="col-5">
                <p>Subscription validity</p>
                <h5>{student.subscription ? new Date(student.s_validity).toLocaleDateString('en-GB') : 'No subscription'}</h5>
              </div>
              <div className={`col-10 bg-${student.subscription ? 'success' : 'danger'} text-white rounded-3 p-3 mt-4`}>
                {!student.subscription || `Yeah! Your subscription is valid till ${new Date(student.s_validity).toLocaleDateString('en-GB')} ${countDays(new Date(), new Date(student.s_validity))} day(s) remaining. Enjoy our meals at discounted price.`}
                {!student.subscription && 'OH! Your subscription is not active please recharge your wallet with a valid subscription plan'}
              </div>
              <div className="col-8 mt-4 ps-0">
                <Link to={`/subscription/${student.student_id}`} className="btn btn-primary py-3 px-3">Recharge Wallet <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></Link>
              </div>
            </div>
          </div>
        </div>
      </>}
    </>
  )
}

export default ViewStudent