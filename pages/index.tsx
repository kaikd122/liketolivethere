import Head from 'next/head'
import prisma from '../lib/prisma'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Review } from '@prisma/client'
import Layout from '../components/layout'
 


export const getStaticProps: GetStaticProps<{reviews: Review[] }> = async() => {

  const reviews = await prisma.review.findMany({
  })
  

  return {props: {reviews: JSON.parse(JSON.stringify(reviews))}, revalidate: 10}


}

export default function Home({ reviews }: InferGetStaticPropsType<typeof getStaticProps>) {

  return (
    <Layout>
      <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet"/>
        <title>Local Expert</title>
        <meta name="description" content="Placeholder" />
      </Head>
        {reviews.map(r=>{
          return<div key={r.id}>Raleway {r.body}</div>
        })}
      <button onClick={()=>{

      }}>Poop Create</button>
    </Layout>
  )
}
