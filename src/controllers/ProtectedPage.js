import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/blocks/Sidebar';
import Context from '../context';

function ProtectedPage(props) {
    const navigate = useNavigate()
    const context = useContext(Context)

    useEffect(() => {
        if (!context.islogged) {
            navigate("/login")
        }
    }, [context.islogged, navigate])

    return (
        context.islogged && 
        <div className="page d-flex flex-row">
            <Sidebar />
            <div className="page-content container m-1 py-2 px-3 bg-white rounded-3">
                {props.element}
            </div>
        </div>
    )
}

export default ProtectedPage