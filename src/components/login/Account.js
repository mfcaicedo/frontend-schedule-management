import {useState, useEffect} from "react"
import {supabase} from "./supabaseClient"
import Avatar from './Avatar'
import PublicRouters from "../../routers/PublicRouters"
//OBTENER VALORES
const Account = ({session}) =>{

    const [loading, setLoading] = useState(true)
    const [username,setUsername] = useState(null)
    const [role, setRole] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(()=>{
        getProfile()
    },[session])

    const getProfile = async () =>{
        try{
            setLoading(true)
            //USUARIO DE LA SESION ACTUAL
            const { data: { user } } = await supabase.auth.getUser()
            //console.log(user.id)
            //OBTENGO USUARIO CON EL ID DE LA SESION
            const {data, error} = await supabase
            .from('profiles')
            .select('username, role, avatar_url')
            .eq('id', user.id)
            .single()
            

            if(data === null){
                setLoading(false)
            }
            console.log(loading)
            if(data){
                setUsername(data.username)
                setRole(data.role)
                setAvatarUrl(data.avatar_url)
            }
        }catch(error){
            alert(error.message)
        }finally{
            //setLoading(false)
        }

    }
   

    const updateProfile = async (e) =>{
        e.preventDefault()

        try{
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            
            const updates = {
                id: user.id,
                username,
                role,
                avatar_url,
                updated_at: new Date()
            }

            let {error} = await supabase.from("profiles")
            .upsert(updates,{returning : 'minimal'})

            if(error){
                throw error;
            }
        }catch(error){
            alert(error.message)
        }finally{
            //setLoading(false)
        }
    }

    return(
        <div aria-live="polite" className='container mx-auto'>
      {loading ? (
        <PublicRouters />
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
            <Avatar
            url={avatar_url}
            size={150}
            onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ username, role, avatar_url: url })
            }}
            />
          {/* <div>Email: {session.user.email}</div> */}
          <div className="container mx-auto w-72 py-4">
                <input type="text" 
                name="text" 
                id="username"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                placeholder="Your Name" 
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
          </div>
          <div className="container mx-auto w-72 py-4">
              <input type="text" 
              name="text" 
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1" 
              placeholder="coordinador, profesor"
              id="role"
              value={role || ''}
              onChange={(e) => setRole(e.target.value)}
              />
            </div>
          <div className='text-center'>
              <button className="w-44 h-11 rounded-full text-gray-50 bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                Update Profile
              </button>
          </div>
          <div className="text-center">
              <button type="button" className="button" onClick={() => supabase.auth.signOut()}>
                  Sign Out
              </button>
          </div>
        </form>
      )}
      
    </div>
    )
}

export default Account;
//ACTUALIZAR VALORES