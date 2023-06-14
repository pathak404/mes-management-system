import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Context from '../../context'
import NoData from '../blocks/NoData'
import Table from '../blocks/Table'
import { API } from '../../api'
import TableSkelton from '../blocks/TableSkelton'

function Students() {
    const context = useContext(Context)
    const [studentData, setStudentData] = useState([])
    const [isloaded, setIsLoaded] = useState(false)

    const columns = {student_id:"Student ID", full_name:"Full Name", father_name:"Father's Name", phone:"Phone", branch:"Branch"}
    
    useEffect(() => {
        context.setLoaderProgress(40)
        API.get('student_all').then((response) => {
            const res = response.data
            if (!res.status) {
                setIsLoaded(true)
            }else{
                setTimeout(() => {
                    setStudentData(res.data.reverse())
                    setIsLoaded(true)
                }, 700)
            }
            context.setLoaderProgress(100)
        })
        // eslint-disable-next-line
    }, [])


    const filterTable = (e) => {
        const newData = studentData.filter((student) => {
            return student.phone.toString().includes(e.target.value) || student.student_id.toString().includes(e.target.value) || 
            student.branch?.toLowerCase().includes(e.target.value.toLowerCase()) || student.full_name?.toLowerCase().includes(e.target.value.toLowerCase())
        })
        return newData
    }


    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># All Students</h3>
                    <div className="ms-auto"><Link to={'new'} className='btn btn-secondary'><FontAwesomeIcon icon={faUserPlus} className='me-2'></FontAwesomeIcon>Add New</Link></div>
                </div>
            </div>
            {isloaded && !studentData.length && <NoData />}
            {isloaded || <TableSkelton search header cols={5} rows={8} />}
            {!(isloaded && studentData.length ) || <Table clickable clickPath="students" clickTerm="student_id" data={studentData} columns={columns} filterTable={filterTable} searchPlaceholder='Search by id, phone, name, branch' />}
        </>
    )
}

export default Students