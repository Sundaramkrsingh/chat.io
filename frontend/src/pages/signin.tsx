import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { Link } from "react-router-dom"
import InputBox from "../components/input-box"
import AuthButton from "../components/auth-button"
import { useRecoilState } from "recoil"
import { userState } from "../stores/atoms/user"

const Signin = () => {
    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userState)
    const [signinInputs, setSigninInputs] = useState({
        email: "",
        password: ""
    })

    // if already signed in then, redirect to lading page
    const redirect = useCallback(() => {
        if (user.email !== "") {
            navigate("/")
        }
    }, [user])

    useEffect(() => {
        redirect()
    }, [redirect])

    // function for handling signin
    const handleSignin = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signin`, signinInputs)
            if (res.data.signin) {
                setUser(res.data.user)
                navigate('/')
            } 
        } catch(e) {
            console.log(e)
            alert('Error while signing in')
        }
    }

    return <div className="h-full">
        <div className="flex flex-col justify-center text-center text-xl md:text-2xl font-bold subpixel-antialiased text-gray-500 font-sans py-3">
            Sign In
        </div>
        <div className="flex flex-col items-center">
            <div className="flex justify-center border rounded-lg shadow-lg border-gray-300 h-max w-4/5 sm:w-1/3">
                <div className="w-4/5">
                    <div className="pt-4">
                        <InputBox text={"email/username"} type={"email"} placeholder={""} value={signinInputs.email} onChange={(val) => setSigninInputs((c) => ({
                            ...c,
                            email: val
                        }))} />
                    </div>
                    <div>
                        <InputBox text={"password"} type={"password"} placeholder={"pass@123"} value={signinInputs.password} onChange={(val) => setSigninInputs((c) => ({
                            ...c, 
                            password: val
                        }))} />
                    </div>  
                    <div className="pt-6">
                        <AuthButton text={"signin"} onClick={handleSignin} />
                    </div>   
                    <div className="flex justify-center text-xs md:text-sm font-sans subpixel-antialiased font-semibold pt-2 pb-6">
                        <div className="text-slate-500">
                            Not a member?
                        </div>
                        <Link to={'/signup'} >
                            <div className="pl-1 text-gray-500 hover:text-gray-700 cursor-pointer">
                                Signup
                            </div>
                        </Link>
                    </div>   
                </div>
            </div>
        </div>
    </div>
}

export default Signin