import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Context from '../../context'
import NoData from '../blocks/NoData'
import Table from '../blocks/Table'
import { API } from '../../api'
import TableSkelton from '../blocks/TableSkelton'

function Transactions() {
    const context = useContext(Context)
    const [TxnsData, setTxnsData] = useState([])
    const [isloaded, setIsLoaded] = useState(false)
    const { customer } = useParams()
    const navigate = useNavigate()

    const searchPlaceholder = customer ? "Search by Txn ID, Type" : "Search by Txn ID, Customer, Type"
    const columns = { txn_id: "Txn ID", customer: "Customer", txn_amount: "Amount ", txn_type: "Type", txn_desc: "Description", created_at: "Date" }

    useEffect(() => {
        context.setLoaderProgress(40)
        let url = !customer ? "transaction_all" : "transaction"
        let data = !customer ? {params: {}} : {params: {customer: customer}}
        API.get(url, data).then((response) => {
            const res = response.data
            if (!res.status) {
                setIsLoaded(true)
            } else {
                setTimeout(() => {
                    setTxnsData(res.data.reverse())
                    setIsLoaded(true)
                }, 700)
            }
            context.setLoaderProgress(100)
        })
        // eslint-disable-next-line
    }, [customer])


    const filterTable = (e) => {
        const newData = TxnsData.filter((txn) => {
            return txn.customer.includes(e.target.value) || txn.txn_id.toLowerCase().includes(e.target.value.toLowerCase()) ||
                txn.txn_type?.toLowerCase().includes(e.target.value.toLowerCase())
        })
        return newData
    }

    return (
        <>
            <div className="page-header border-bottom py-3">
                <div className="hstack">
                    <h3 className='text-dark'># Transactions</h3>
                    {!customer || <div className="ms-auto"><button className='btn btn-secondary' onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} className='me-2'></FontAwesomeIcon>Back</button></div>}
                </div>
            </div>
            {isloaded && !TxnsData.length && <NoData />}
            {isloaded || <TableSkelton search header cols={6} rows={8} />}
            {!(isloaded && TxnsData.length) || <Table data={TxnsData} columns={columns} filterTable={filterTable} searchPlaceholder={searchPlaceholder} />}
        </>
    )
}

export default Transactions