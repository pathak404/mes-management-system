import React from 'react'

function TableSkelton({ cols, rows, search, header }) {

    return (
        <>
            {search && <div className="my-4 placeholder-glow mx-2">
                <div className='placeholder py-3 rounded-1' style={{width: '310px'}}></div>
            </div>}

            <div className="my-2 w-100 mx-2">

                {!header || <div className='row border-1 border-bottom p-4 placeholder-glow gap-4 bg-light'>
                    {[...Array(cols).keys()].map(i => {
                            return <div key={i} className="col placeholder py-3 rounded-1"></div>
                        })}
                </div>}


                {[...Array(rows).keys()].map(i => {
                    return <div className='row border-1 border-bottom p-4 placeholder-glow gap-4' key={i}>
                        {[...Array(cols).keys()].map(i => {
                            return <div key={i} className="col placeholder py-3 rounded-1"></div>
                        })}
                    </div>
                })}

            </div>
        </>
    )
}

export default TableSkelton