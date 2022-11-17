import { User } from "@prisma/client";
import prisma from "../prisma";



export async function updateUsername(id: string, username: string){
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: username
        }
    })

}