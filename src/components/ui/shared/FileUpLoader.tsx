import { useCallback, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../button'

type FileUploaderProps = {
  feildChange: (Files: File[]) => void
  mediaUrl: string
}

function FileUpLoader({ feildChange, mediaUrl }: FileUploaderProps) {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState('')
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      feildChange(acceptedFiles)
      setFileUrl(URL.createObjectURL(acceptedFiles[0]))
    },
    [file]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.svg'] },
  })

  return (
    <div
      className='flex flex-center flex-col bg-dark-3 cursor-pointer rounded-xl'
      {...getRootProps()}>
      <input {...getInputProps()} className=' cursor-pointer' />
      {fileUrl ? (
        <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
            <img src={fileUrl} alt='image' className='file_uploader-img' />
          </div>
          <p className='flie_uploader-label'>Click or drag photo to replace</p>
        </>
      ) : (
        <div className='file_uploader-box'>
          <img
            src='/assets/icons/file-upload.svg'
            width={96}
            height={77}
            alt='file upload'
          />
          <h3 className='base-medium text-light-2 mb-2 mt-6'>
            Drag photo here
          </h3>
          <p className='text-light-4 small-regular mb-6'>SVG,PNG,JPG</p>
          <Button className='shad-button_dark_4'>Select from PC</Button>
        </div>
      )}
    </div>
  )
}

export default FileUpLoader
