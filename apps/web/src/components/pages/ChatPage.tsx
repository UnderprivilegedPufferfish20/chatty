"use client"

import React, { useEffect, useState } from 'react'
import { useSocket } from '../providers/ChatWSProvider'

const ChatPage = ({ user, receiver, friendRel }: { user:any, receiver:any, friendRel:any }) => {
  if (!friendRel.chats) {
    return (
      <div className='items-center justify-center flex'>
        <p className='text-muted-foreground'>Be the first to say Hi!</p>
      </div>
    )
  }
  const [messages, setMessages] = useState<any[]>(friendRel.chats)
  const [currentMsg, setCurrentMsg] = useState<string>('')


  const socket = useSocket()

  const handleSendMessage = (message: string) => {
    if(!socket) return;

    socket.emit('sendChat', {
      message, 
      friendId: receiver.id
    })

    setCurrentMsg('')
  }

  useEffect(() => {
    if (!socket) return;
    
    socket.on('new_message', (data: { to: string, message: any, from: string }) => {
      // Show message if it's FOR this user OR FROM this user (in this conversation)
      if ((data.to === user.id && data.from === receiver.id) || 
          (data.from === user.id && data.to === receiver.id)) {
        setMessages(p => [...p, data.message])
      }
  })
  
  return () => {
    socket.off('new_message') // Cleanup
  }
}, [socket, user.id, receiver.id])

  return (
    <div className='relative h-full flex flex-col'>
      {/* Scrollable messages container */}
      <div className='flex-1 overflow-y-auto p-4 space-y-2'>
        {
          messages.map(m => (
            <p key={m.id}>{m.message}</p>
          ))
        }
      </div>
      
      {/* Fixed input at the bottom */}
      <div className='sticky bottom-0 p-4 bg-background border-t'>
        <input 
          value={currentMsg}
          onChange={e => setCurrentMsg(e.target.value)}
          className='w-full rounded-2xl p-2 border border-input'
          placeholder='Send a message'
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSendMessage(currentMsg)
            }
          }}
        />
      </div>
    </div>
  )
}

export default ChatPage