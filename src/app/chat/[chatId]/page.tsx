import ChatComponents from '@/components/chat-component';
import ChatSidebar from '@/components/chat-sidebar';
import PdfViewer from '@/components/pdf-viewer';
import { prismadb } from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { FC } from 'react';
interface Props {
  params: {
    chatId: string;
  };
}
const ChatPage: FC<Props> = async ({ params: { chatId } }) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/sign-in');
  }
  const chats = await prismadb.chat.findMany({
    where: {
      userId,
    },
  });
  if (!chats) {
    return redirect('/');
  }
  if (!chats.find(chat => chat.id === chatId)) {
    return redirect('/');
  }
const currentChat=await prismadb.chat.findUnique({
  where:{
    id:chatId
  }
})
  return (
    <div className="flex max-h-screen overflow-hidden  ">
      
        {/* Chat Side bar */}
        <div className="w-[20%] max-w-xs overflow-y-scroll no-scrollbar">
          <ChatSidebar chatId={chatId} chats={chats} />
        </div>
        {/* PDF viewer */}
        <div className="max-h-screen p-4 overflow-y-scroll no-scrollbar w-[50%]  ">
      <PdfViewer pdf_url={currentChat?.pdfUrl||""} />
        </div>
        {/* Chat components */}
        <div className="w-[30%] relative border-l-4 overflow-y-scroll no-scrollbar border-l-slate-200">
         <ChatComponents chatId={chatId} />
        </div>
      </div>
    
  );
};

export default ChatPage;
