import React, { useRef } from 'react'

function Modal(props) {
    const { heading, message, allowText, disallowText, onAllow } = props.data
    const inputRef = useRef(0)
    const handler = (e) => {
        if (e.target.id === "allow") {
            onAllow(inputRef.current.value)
        }
        props.setModalData({})
    }

    return (
        JSON.stringify(props.data) !== '{}' &&
        <div className="modal modal-alert position-fixed hstack" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" style={{ top: '-60px', width: '470px' }}>
                <div className="modal-content rounded-3 shadow bg-white border-0">
                    <div className="modal-body p-4 text-center">
                        <h5 className="mb-2 fw-bold text-dark">{heading}</h5>
                        <p className="mb-3">{message}</p>
                        <form>
                            <input type="password" className='form-control bg-white shadow-none mt-2' ref={inputRef} placeholder="Enter Secret Password" autoComplete='new-password'/>
                        </form>
                    </div>
                    <div className="modal-footer flex-nowrap justify-content-center p-0">
                        {onAllow && <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border-end fw-bold" id="allow" onClick={handler}>{allowText}</button>}
                        <button type="button" className="btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0" onClick={handler}>{disallowText ?? 'Close'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal