import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faCalendar, faUser, faMoneyBills, faUtensils, faTicket, faArrowRightFromBracket, faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Link } from 'react-router-dom'
import '../../assets/css/Sidebar.css'
import Context from '../../context'
import { useContext } from 'react'
import logoShort from '../../assets/images/logo-short.png'

function Sidebar() {
  let adminData = localStorage.getItem('account')
  const adminName = adminData ? JSON.parse(adminData)?.full_name : 'Admin'
  const context = useContext(Context)
  
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-white vh-100 mh-100 d-print-none" style={{ width: '280px', position:'sticky', top: 0 }}>
      <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <img src={logoShort} width={50} height={50} className="rounded-1 me-3" alt=''/>
        <span className="fs-5"><span className='small'>Hello 👋</span> <br/> {adminName.split(' ', 2)[0]}</span>
      </Link>
      <hr />

      <ul className="nav nav-pills mb-auto py-4">
        <li className="nav-item mb-4">
          <NavLink to="/" className="nav-link">
            <span className="me-3"><FontAwesomeIcon icon={faHouse} size='lg' /></span>
            Dashboard
          </NavLink>
        </li>

        {/* <li className="nav-item mb-4">
          <NavLink to="/wallet" className="nav-link mb-3">
          <span className="me-3"><FontAwesomeIcon icon={faWallet} size='lg' /></span>
            Wallet
          </NavLink>
        </li> */}


        <li className="nav-item mb-4">
          <NavLink to="/students" className="nav-link mb-3">
          <span className="me-3"><FontAwesomeIcon icon={faUserGroup} size='lg' /></span>
            Students
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink to="/order" className="nav-link mb-3">
          <span className="me-3"><FontAwesomeIcon icon={faUtensils} size='lg' /></span>
            Meal Order
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink to="/attendance" className="nav-link mb-3">
            <span className="me-3"><FontAwesomeIcon icon={faCalendar} size='lg' /></span>
            Attendance
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink to="/subscription" className="nav-link mb-3">
            <span className="me-3"><FontAwesomeIcon icon={faTicket} size='lg' /></span>
            Subscription
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink to="/transactions" className="nav-link mb-3">
          <span className="me-3"><FontAwesomeIcon icon={faMoneyBills} size='lg' /></span>
            Transactions
          </NavLink>
        </li>

        <li className="nav-item mb-4">
          <NavLink to="/account" className="nav-link mb-3">
          <span className="me-3"><FontAwesomeIcon icon={faUser} size='lg' /></span>
            Account
          </NavLink>
        </li>
      </ul>

      <div className="mt-auto border-top border-2">
        <div className="p-3" style={{cursor: 'pointer'}} onClick={() => context.logout()}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} className='fa-rotate-180 me-3'/>
          Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar