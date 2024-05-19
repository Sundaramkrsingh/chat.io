import { useRecoilValueLoadable } from "recoil"
import { fetchUserState } from "../stores/atoms/user"
import { Navigate } from "react-router-dom"
import { ReactNode } from "react"

interface ProtectedRouteProps {
    children: ReactNode;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const userLoadable = useRecoilValueLoadable(fetchUserState)

    switch (userLoadable.state) {
        case "hasValue": 
            return userLoadable.contents? children: <Navigate to="/signin" />
        case "loading":
            return <div>Loading...</div>
        case "hasError": 
        default:
            return <Navigate to="/signin" />
    }
}

export default ProtectedRoute