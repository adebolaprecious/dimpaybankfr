import React from 'react'

const NotFound = () => {
  return (
    <div className='d-flex flex-column gap-4 align-items-center justify-content-center' style={{height:"100hv"}}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>

      <button className='btn btn-dark'>Run to safety</button>
    </div>
  )
}

export default NotFound