import React from 'react'

export const Notify = ({ errorMessage }) => {


    // console.log(`inside notify: ${errorMessage}`)
    if (!errorMessage) {
        return null
    }

    return (
        <div style={{ color: 'red' }}>
            {errorMessage}
        </div>
    )
}
