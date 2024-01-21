"use client"
import React, { useEffect } from 'react'
import { Input } from './ui/input'
import {useChat} from 'ai/react'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'
import MessageList from './message-list'

interface Props{
  chatId:string
}
const ChatComponents = ({chatId}:Props) => {
  const {data,isPending}=useQuery({
    queryKey:['chat',chatId],
    queryFn:async()=>{
      const response=await axios.post<Message[]>(`/api/get-messages`,{
        chatId
      });
      return response.data;
    }
  });

  const {input,handleInputChange,handleSubmit,messages}=useChat({
    api:'/api/chat',
    body:{
      chatId
    },
    initialMessages:data||[]
  });
useEffect(()=>{
  const messageContainer=document.getElementById("message-container");
  if(messageContainer){
    messageContainer.scrollTo({
      top:messageContainer.scrollHeight,
      behavior:"smooth"
    })
  }
},[messages])
  return (
     <div className="relative max-h-screen h-full " id='message-container' >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      {/* Message List */}
      <MessageList isPending={isPending} messages={messages} /> 
      <form onSubmit={handleSubmit} className='sticky bottom-0 inset-x-0 px-2 py-4 bg-white' >
        <div className="flex">
          <Input value={input} onChange={handleInputChange} placeholder='Ask any question !' className='w-full' />
          <Button className='bg-violet-600 ml-2 text-white' >
            <Send className='h-4 w-4' />
          </Button>
        </div>
      </form>
     </div>
  )
}

export default ChatComponents