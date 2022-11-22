import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { updateUserCommand, updateUserArgs } from '../../lib/actions/user'
function ProfileId() {

    const {data: session} = useSession()

    const [value, setValue] = useState("")

    async function handleSubmit(e: React.MouseEvent){
        e.preventDefault()        
        const args: updateUserArgs = {userId: session?.user?.id, data: {name: value}}
        const res = await updateUserCommand(args)
        const data = await res.json()
        console.log(data)

     




    }
  return (
      <Layout>
    <form>
        <input onChange={((e)=>setValue(e.target.value))} value={value} defaultValue={session?.user?.name}/>
        <button type="submit" onClick={e=>(handleSubmit(e))}>Change username</button>
        </form>
    </Layout>
  )
}

export default ProfileId