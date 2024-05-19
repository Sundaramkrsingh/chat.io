import { Link, useNavigate } from "react-router-dom"
import Applogo from "./app-logo"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { fetchUserState, userState } from "../stores/atoms/user"
import { useEffect } from "react"

const AppBar = () => {
    const [user, setUser] = useRecoilState(userState)
    const userLoadable = useRecoilValueLoadable(fetchUserState)

    useEffect(() => {
        if (userLoadable.state === "hasValue" && userLoadable.contents) {
            setUser(userLoadable.contents)
        } 
    }, [userLoadable.state])

    return <div className="sticky top-0 z-50 flex h-16 shadow-md bg-gray-400 w-full border-b border-gray-400"> 
        <Link to={'/'}> <Applogo /> </Link>
        <div className="flex w-full justify-end">
            <Button text={user.email === ""? "signin": "signout"} setUser={setUser} />
        </div>
    </div>  
}

const Button = ({ text, setUser }: {
    text: string,
    setUser: React.Dispatch<any>
}) => {
    const navigate = useNavigate()

    // direct to signin page
    function handleOnNotSignedIn() {
        navigate('/signin')
    }

    // function for signing out
    async function handleSignOut() {
        try {
            const res = await axios.get(`${BACKEND_URL}/user/signout`)
            if (res.data.signout) {
                setUser({
                    username: "",
                    email: ""
                })
                navigate('/')
            }
        } catch(e) {
            console.log(e)
            alert("Error in signing out")
        }
    }

    return <button type="button" className="pt-0.5 pb-0.5 px-2 my-3 mx-3 md:mx-6 md:pt-1 md:pb-1.5 md:px-4 bg-white hover:bg-slate-200 inline-flex items-center text-sm md:text-base subpixel-antialiased font-semibold rounded-lg border-2 border-zinc-600 shadow-lg text-zinc-500 hover:border-zinc-700 hover:text-zinc-700" onClick={text === "signin"? handleOnNotSignedIn: handleSignOut}>
        { text } 
    </button>
} 

export default AppBar