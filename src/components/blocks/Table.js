import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../assets/css/Table.css'

function Table({ clickable, clickPath, clickTerm, data, filterTable, columns, searchPlaceholder }) {
    const navigate = useNavigate()
    const [filtered, setFiltered] = useState(data)

    // console.log("re-rendered")

    const filter = (e) => {
        setFiltered(filterTable(e))
    }

    
    return (
        <>
            {!searchPlaceholder || <div className="my-4 text-center m-auto mx-2">
                <input type="search" className='form-control shadow-none bg-white border-2' placeholder={searchPlaceholder} onChange={filter} style={{width: '310px'}}/>
            </div>}

            <div className="table-responsive mx-2">
                <table className={`table align-middle ${clickable && 'clickable'}`}>
                    <thead className='table-light'>
                        <tr className='align-middle'>
                            {Object.keys(columns).map((col, i) => <th scope="col" key={i}>{columns[col]}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {!clickable && filtered.map((single, i) => {
                            return (
                                <tr key={i}>
                                    {Object.keys(columns).map((col, i) => <td key={i}>{single[col]}</td>)}
                                </tr>
                            )
                        })}

                        {clickable && filtered.map((single, i) => {
                            return (
                                <tr onClick={() => navigate(`/${clickPath}/${single[clickTerm]}`)} key={i}>
                                    {Object.keys(columns).map((col, i) => <td key={i}>{single[col]}</td>)}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table