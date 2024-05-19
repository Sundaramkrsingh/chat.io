import { useRecoilState, useRecoilValueLoadable } from "recoil"
import { fetchUserState, userState } from "./stores/atoms/user"
import { useCallback, useEffect } from "react"
import axios from "axios"
import { Route, Routes } from "react-router-dom"
import Signup from "./pages/signup"
import Signin from "./pages/signin"
import ProtectedRoute from "./components/protected-route"
import Chat from "./pages/chat"
import ErrorPage from "./components/error-page"
import LandingPage from "./pages/landing"

axios.defaults.withCredentials = true

function App() {
    const [user, setUser] = useRecoilState(userState)
    const userLoadable = useRecoilValueLoadable(fetchUserState)

    const handleSessionFetch = useCallback(async () => {
        if (userLoadable.state === 'hasValue' && userLoadable.contents) {
            setUser(userLoadable.contents)
        }
    }, [userLoadable.state, userLoadable.contents, setUser])

    useEffect(() => {
        handleSessionFetch()
    }, [handleSessionFetch])

    return (
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="*" element={<ErrorPage />} />
      </Routes> 
    )
}

export default App;
