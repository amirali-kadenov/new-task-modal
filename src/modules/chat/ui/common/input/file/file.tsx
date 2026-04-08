import { useRef } from 'react'

import AttachIcon from '@/assets/icons/chat/attach.svg'

import s from './file.module.scss'

interface Props {
  onAddFile: (file: File) => void
  disabled?: boolean
}

export const FileInput = ({ onAddFile, disabled }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAddFile(file)
    }
  }

  return (
    <>
      <button
        className={s.fileButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        type="button"
      >
        <AttachIcon />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </>
  )
}
