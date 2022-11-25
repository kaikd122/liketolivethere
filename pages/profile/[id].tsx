import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { useCtx } from '../../context/Context'
import { updateUserCommand, updateUserArgs, getUserRequest } from '../../lib/actions/user'
function ProfileId() {
    const ctx = useCtx()

    const {data: session} = useSession()

    const [value, setValue] = useState("")

    async function handleSubmit(e: React.MouseEvent){
        e.preventDefault()        
        const getRes = await getUserRequest({name: value})
        if (getRes.ok) {
            
            console.log("NOT OK")

        } else {
            console.log("OK")
        }


        const args: updateUserArgs = {userId: session?.user?.id, data: {name: value}}
        const updateRes = await updateUserCommand(args)
        if (updateRes.ok) {
            ctx.setUser({...ctx.user, name: value})

        } else {
            console.log("NOT OK")
        }
        

     




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