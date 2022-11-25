import Head from 'next/head'
import prisma from '../lib/prisma'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Review, User } from '@prisma/client'
import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCtx } from '../context/Context'
import { updateUserArgs, updateUserCommand } from '../lib/actions/user'
import generateUsername from '../lib/util/generate-username'
 


export const getStaticProps: GetStaticProps<{reviews: Review[] }> = async() => {

  const reviews = await prisma.review.findMany({
  })
  

  return {props: {reviews: JSON.parse(JSON.stringify(reviews))}, revalidate: 10}


}

export default function Home({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {
  const {data: session} = useSession()
  const ctx = useCtx()
  useEffect(()=>{
    console.log("UF", 29)
    if (!session) {
      return
    }
    console.log("UF", 33)


    if (ctx.user?.id) {

      if (ctx.user?.name != session?.user?.name)
      {
        console.log(37)
        ctx.setUser({...ctx.user, name: session?.user.name})
      }



      return 
    }

    if (session.user?.name){
      const user: User = {
        email: session?.user?.email,
        emailVerified: null,
        id: session?.user?.id,
        image: null,
        name: session?.user?.name 
      }
      ctx.setUser(user)
      return
    }

    if (!ctx.user?.name) {
      const newName = generateUsername()
      const args: updateUserArgs = {userId: session?.user?.id, data: {name: newName}}
      const updateUser = async()=>{
        const res = await updateUserCommand(args)
        const data = await res.json()
        return data
      }
      const data = updateUser()
      console.log(data)
      const user: User = {
        email: session?.user?.email,
        emailVerified: null,
        id: session?.user?.id,
        image: null,
        name: newName
      }
      ctx.setUser(user)
      return   
    }


    

  }, [session?.user?.name])
  return (
    <>
    <Head>
    <title>Local Expert</title>
     <meta name="description" content="Placeholder" />
   </Head>
    <Layout>
     
        {reviews.map(r=>{
          return<div key={r.id}>Raleway {r.body}</div>
        })}
      <button onClick={()=>{

      }}>Poop Create</button>
    </Layout>
    </>
  )
}
