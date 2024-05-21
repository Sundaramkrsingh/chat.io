import axios from "axios";
import { atom, selector } from "recoil";
import { BACKEND_URL } from "../../config";

export const messagesState = atom({
    key: "message-state",
    default: [{
        username: "",
        text: "",
        timeStamp: ""
    }]
})


export const fetchMessageState = selector({
    key: "fetch-message-state",
    get: async () => {
        try {   
            const res = await axios.get(`${BACKEND_URL}/chat/messages`)
            return res.data.messages
        } catch(err) {
            console.error('Error fetching messages:', err)
        }

        return null
    }
})