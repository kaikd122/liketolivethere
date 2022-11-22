import { User } from "@prisma/client";
import prisma from "../prisma";


export interface updateUserArgs {
    userId: string,
    data: {
        name?: string
    }

}

export async function updateUserCommand(args: updateUserArgs){

        const res = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
    

    return res
}