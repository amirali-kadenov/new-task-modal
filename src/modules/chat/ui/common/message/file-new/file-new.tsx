import FileIcon from '@/assets/icons/chat/file.svg'
import { Button, ButtonColor, ButtonLayout } from '@/ui/button/button'

import s from './file-new.module.scss'

interface FileMessageProps {
  fileName: string
  fileSize?: number
  fileUrl: string
}

export default function FileMessage({
  fileName,
  fileSize,
  fileUrl,
}: FileMessageProps) {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.click()
  }

  const formattedSize = formatFileSize(fileSize)

  return (
    <div className={s.content}>
      <Button
        color={ButtonColor.White}
        layout={ButtonLayout.Icon}
        className={s.iconButton}
        onClick={handleDownload}
      >
        <FileIcon className={s.fileIcon} />
      </Button>
      <div className={s.fileInfo}>
        <span className={s.fileName}>{fileName}</span>
        {formattedSize && <span className={s.fileSize}>{formattedSize}</span>}
      </div>
    </div>
  )
}

const formatFileSize = (bytes?: number) => {
  if (bytes == null || Number.isNaN(bytes)) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
