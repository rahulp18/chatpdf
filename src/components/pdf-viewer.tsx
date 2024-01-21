import React from 'react'

const PdfViewer = ({pdf_url}:{pdf_url:string}) => {
     
  return (
    <iframe className='w-full h-full'  src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}>

    </iframe>
  )
}

export default PdfViewer
