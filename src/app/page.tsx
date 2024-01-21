import FileUpload from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="min-h-screen flex justify-center items-center w-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600">
      <div className="flex items-center justify-center flex-col gap-5 max-w-[500px]">
        <div className='flex flex-col items-center gap-2' >
        <div className="flex gap-2 items-center">
          <h1 className="sm:text-4xl text-2xl text-white font-medium">
            Chat with any PDF
          </h1>
        <UserButton afterSignOutUrl="/" />
        </div>
        <p className="text-slate-50 sm:text-lg text-base text-center">
          Join millions of students,researchers,working professional to
          instantly  question and understand research with AI
        </p>
        </div>
        <div className="w-full flex items-center justify-center">
          {isAuth ? (
            <FileUpload/>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-white text-black hover:bg-slate-50">
                Login to get started <LogIn size={20} className='ml-1' />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
