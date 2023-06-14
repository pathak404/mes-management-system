import React from 'react'
import NoDataSVG from '../../assets/images/no_data.svg'

function NoData() {
  return (
    <div className='w-100 d-flex align-items-center justify-content-center flex-column' style={{minHeight: '400px'}}>
        <img src={NoDataSVG} width={130} height={130} alt='' />
        <h4 className='mt-4'>No Data Found</h4>
    </div>
  )
}

export default NoData