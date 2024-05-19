import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import { useNavigate } from "react-router-dom"
import InputBox from "../components/input-box"
import AuthButton from "../components/auth-button"
import { useRecoilState } from "recoil"
import { userState } from "../stores/atoms/user"

const Signup = () => {
    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userState)
    const [signupInputs, setSignupInputs] = useState({
        username: "",
        email: "",
        password: ""
    })

    // if already signedin, then redirect to landing page
    const redirect = useCallback(() => {
        if (user.email !== "") {
            navigate("/")
        }
    }, [user])

    useEffect(() => {
        redirect()
    }, [redirect])

    // function for handling signup
    const handleSignup = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signup`, signupInputs)
            if (res.data.signup) {
                setUser(res.data.user)
                navigate('/')
            } 
        } catch(e) {
            console.log(e)
            alert("Error while signing up")
        }
    }

    return <div className="h-full">
        <div className="flex flex-col justify-center text-center text-2xl font-bold subpixel-antialiased text-gray-500 font-sans py-3">
            Sign Up
        </div>
        <div className="flex flex-col items-center">
            <div className="flex justify-center border rounded-lg shadow-lg border-gray-300 h-max w-4/5 sm:w-1/3">
                <div className="w-4/5">
                    <div className="pt-4">
                        <InputBox text={"username"} type={"text"} placeholder={""} value={signupInputs.username} onChange={(val) => setSignupInputs((c) => ({
                            ...c, 
                            username: val
                        }))} />
                    </div>
                    <div>
                        <InputBox text={"email"} type={"email"} placeholder={"xyz@gmail.com"} value={signupInputs.email} onChange={(val) => setSignupInputs((c) => ({
                            ...c,
                            email: val
                        }))} />
                    </div>
                    <div>
                        <InputBox text={"password"} type={"password"} placeholder={"pass@123"} value={signupInputs.password} onChange={(val) => setSignupInputs((c) => ({
                            ...c,
                            password:val
                        }))} />
                    </div>  
                    <div className="py-6">
                        <AuthButton text={"signup"} onClick={handleSignup} />
                    </div>      
                </div>
            </div>
        </div>
    </div>
}

export default Signup