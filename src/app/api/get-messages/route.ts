import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";


// export const runtime="edge"

export const POST=async(req:Request)=>{
 try {
    const {chatId}=await req.json();

    const messages=await prismadb.message.findMany({
        where:{
            chatId
        }
    });
return NextResponse.json(messages);
 } catch (error) {
    return NextResponse.json({error:'Error in getting messages'},{status:400});
 }
}