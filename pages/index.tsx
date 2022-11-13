import Head from 'next/head'
import prisma from '../lib/prisma'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Review } from '@prisma/client'
import Layout from '../components/Layout'
 


export const getStaticProps: GetStaticProps<{reviews: Review[] }> = async() => {

  const reviews = await prisma.review.findMany({
  })
  

  return {props: {reviews: JSON.parse(JSON.stringify(reviews))}, revalidate: 10}


}

export default function Home({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {

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
