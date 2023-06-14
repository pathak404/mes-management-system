import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicNavbar from '../public/PublicNavbar';
import Context from '../context';

function PublicPage(props) {
    const navigate = useNavigate()
    const context = useContext(Context)

    useEffect(() => {
        if (props.redirect && context.islogged) {
            navigate("/")
        }
    }, [context.islogged, props.redirect, navigate])

    return (
        <>
            {!(props.redirect && context.islogged) && !props.noHeader && <PublicNavbar islogged={context.islogged} />}
            {!(props.redirect && context.islogged) && props.element}
        </>
    )
}

export default PublicPage