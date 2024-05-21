import axios from "axios"
import { atom, selector } from "recoil"
import { BACKEND_URL } from "../../config"

export const userState = atom({
    key: "user-state",
    default: {
        username: "",
        email: ""
    }
})

export const fetchUserState = selector({
    key: "fetch-user-state",
    get: async () => {
        try {
            const res = await axios.get<ResponseType>(`${BACKEND_URL}/session`, { withCredentials: true })
            if (res.data.isAuthenticated) {
                const data = res.data.user
                return data // Assuming the response has a user object
            } 
        } catch(err) {
            console.error('Error fetching user data:', err)
        }
        
        return null
    }    
})

type ResponseType = {
    isAuthenticated: boolean;
    user: {
        username: string;
        email: string;
    };
}