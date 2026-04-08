import DownloadIcon from '@/assets/icons/chat/download.svg'
import FileIcon from '@/assets/icons/chat/file.svg'

import s from './file.module.scss'

interface FileMessageProps {
  fileName: string
  fileSize: number
  fileType?: string
  fileUrl: string
}

export default function FileMessage({
  fileName,
  fileSize,
  fileUrl,
}: FileMessageProps) {
  return (
    <div className={s.fileMessage}>
      <div className={s.fileIcon}>
        <FileIcon />
      </div>
      <div className={s.fileInfo}>
        <span className={s.fileName}>{fileName}</span>
        <span className={s.fileSize}>{formatFileSize(fileSize)}</span>
      </div>
      <a
        href={fileUrl}
        download={fileName}
        className={s.downloadButton}
        aria-label="Download file"
      >
        <DownloadIcon width={20} height={20} />
      </a>
    </div>
  )
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
