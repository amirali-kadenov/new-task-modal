import { useRef, useState } from 'react'

interface Message {
  id: number
  text: string
  senderUserId: number
  senderFullname: string
  sentAt: string
  isUnread?: boolean
  type?: string
  isFromPupil?: boolean
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'mentor'>('ai')
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
}
