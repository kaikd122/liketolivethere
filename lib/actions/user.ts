import { User } from "@prisma/client";
import prisma from "../prisma";


export interface updateUserArgs {
    userId: string,
    data: {
        name?: string
    }
}

export interface getUserArgs {
    userId?: string,
    name?: string,
}

export async function updateUserCommand(args: updateUserArgs){
        const res = await fetch('/api/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
    return res
}

export async function getUserRequest(args: getUserArgs){
    let queryParam: string = '?'
    if (args.name) {
        queryParam += `name=${args.name}`
    } else {
        queryParam += `userId=${args.userId}`

    }
    const res = await fetch(`/api/getUser${queryParam}`, {

        method: 'GET',
        headers: { 'Content-Type': 'application/json' },

    })
    return res
}