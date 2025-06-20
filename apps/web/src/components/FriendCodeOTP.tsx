"use client"

import React, { useActionState, useRef, useState } from 'react'
import { Input } from './ui/input'
import { addFriend } from '@/lib/actions'

const FriendCodeOTP = () => {
  const [state, action] = useActionState(addFriend, undefined)
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    
    if (sanitizedValue.length <= 1) {
      const newValues = [...values]
      newValues[index] = sanitizedValue
      setValues(newValues)

      // Auto focus next input
      if (sanitizedValue && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    
    if (pastedData.length <= 6) {
      const newValues = [...values]
      for (let i = 0; i < 6; i++) {
        newValues[i] = pastedData[i] || ''
      }
      setValues(newValues)
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }


  return (
    <div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-2 justify-center'>
          {values.map((value, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; return; }}
              type="text"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-mono border-2 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              maxLength={1}
              autoComplete="off"
            />
          ))}
        </div>
        
        <div className='text-center'>
          <p className='text-sm text-gray-500 mb-2'>Enter 6-digit friend code</p>
          {state?.error && <p className='text-red-400 text-sm'>{state.error.code}</p>}
          {state?.message && <p className='text-green-400 text-sm'>{state.message}</p>}
        </div>

        <button
          type="button"
          onClick={() => {
            const code = values.join('')
            const formData = new FormData()
            formData.append('code', code)
            action(formData)
          }}
          disabled={values.some(v => !v)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Add Friend
        </button>
      </div>  
    </div>
  )
}

export default FriendCodeOTP