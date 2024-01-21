'use client';
import { Chat } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { MessageCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Props {
  chats: Chat[];
  chatId: string;
}
const ChatSidebar = ({ chats, chatId }: Props) => {
  return (
    <div className="h-screen relative bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-gray-200 p-3">
      <Link href="/">
        <Button className="w-full mt-4 bg-transparent border-white border text-white border-dashed hover:bg-gray-900">
            <PlusCircle className='mr-2 h-4 w-4' />
          New Chat
        </Button>
      </Link>
        <div className="mt-5 flex flex-col gap-2 ">
            {
                chats.map((chat)=>(
                    <Link href={`/chat/${chat.id}`} className='' key={chat.id}>
                    <div className="group relative">
                      <div className={cn("flex items-center gap-1 bg-opacity-60  font-normal   text-white px-2 py-3 rounded-lg backdrop-blur-lg transition backdrop-filter hover:backdrop-filter-none",chat.id===chatId?'bg-purple-900':'bg-transparent')}>
                        <MessageCircle className='h-4 w-4' />
                        <p className="text-sm">{chat.pdfName}</p>
                      </div>
                    </div>
                  </Link>
                ))
            }
        </div>
        <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 justify-between">

            <Link href={'/'} className='text-gray-400 text-sm underline' >Home</Link>
            <Link href={'https://www.linkedin.com/in/rahul-pradhan-developer/'} target='_blank' className='text-gray-400 text-sm ' >Developed By <span className='text-gray-100 underline' >Rahul Pradhan</span></Link>
            </div>
        </div>
    </div>
  );
};

export default ChatSidebar;
