import { useState, useEffect, useCallback, useRef } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { fetchMessageState, messagesState } from '../stores/atoms/messages'
import { userState } from '../stores/atoms/user'

const Chat = () => {
    const user = useRecoilValue(userState)
    const [messages, setMessages] = useRecoilState(messagesState)
    const messagesLoadable = useRecoilValueLoadable(fetchMessageState)
    const [messageText, setMessageText] = useState("")
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // fetches messages on re-render
    const handleSessionFetch = useCallback(async () => {
        if (messagesLoadable.state === 'hasValue' && messagesLoadable.contents) {
            setMessages(messagesLoadable.contents)
        }
    }, [messagesLoadable, setMessages])
    
    useEffect(() => {
        handleSessionFetch()
    }, [handleSessionFetch])


    // handles socket state
    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:3000/api/v1/chat")

        newSocket.onmessage = async (event: MessageEvent) => {
            const message = JSON.parse(event.data)
            const messageObj = {
                username: message.username,
                text: message.text,
                timeStamp: message.timeStamp.toLocaleString(),
            }
            setMessages((prevMessages) => [...prevMessages, messageObj])
        }

        newSocket.onclose = () => {
            console.log("WebSocket connection closed")
        }

        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [user.username, setMessages])


    // Scroll to the bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    
    // function handles send click
    const sendMessage = useCallback(() => {
        if (messageText && socket && socket.readyState === WebSocket.OPEN) {
            const messageObj = {
                username: user.username,
                text: messageText,
                timeStamp: new Date().toLocaleString(),
            }

            socket.send(JSON.stringify(messageObj))
            setMessageText('')
        }
    }, [messageText, socket, user.username, setMessages])

    
    const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value)
    }, [])

    return <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col w-2/3 sm:w-1/2 my-4">
            <TopBar user={user} />
            <MessageScroll messages={messages} messagesEndRef={messagesEndRef} />
            <InputBar onChange={handleMessageChange} sendMessage={sendMessage} value={messageText} />
        </div>
    </div>
}

const TopBar = ({ user }: {
    user: {
        username: string,
        email: string
    }
}) => {

    return <div className="flex items-center h-10 bg-zinc-500 text-white rounded-t-lg pl-3 py-1">
        <div className="flex flex-col justify-center text-center rounded-full h-6 w-6 sm:h-8 sm:w-8 bg-zinc-100 text-gray-600 text-xl sm:text-2xl font-light pb-2">
            {user.username[0]}
        </div>
        <div className="ml-2 ">
            <div className="text-xs sm:text-sm">{user.username}</div>
            <div className="text-username font-thinner">{user.email}</div>
        </div>
    </div>
}

// message scroller screen
const MessageScroll = ({ messages, messagesEndRef }: {
    messages: {
        username: string;
        text: string;
        timeStamp: string;
    }[],
    messagesEndRef: React.RefObject<HTMLDivElement>
}) => {

    return <div className="flex flex-col items-end p-4 bg-gray-200 h-80 overflow-y-auto">
        {messages.map((msg, index) => (
            <MessageBox index={index} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
    </div>  
}

// bottom input bar 
const InputBar = ({ value, onChange, sendMessage }: {
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    sendMessage: () => void
}) => {

    return <div className="flex bg-gray-400 h-12 px-3 sm:px-6 py-1.5 rounded-b-lg">
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={"type message"}
            className="rounded-lg px-1.5 sm:px-3 py-1 block w-full mr-1 outline-none text-xs sm:text-sm font-sans text-gray-700"
        /> 
        <button 
            onClick={sendMessage}
            className="bg-gray-600 hover:bg-gray-800 p-1.5 rounded-lg text-white text-xs sm:text-sm font-sans outline-none focus:bg-gray-800"
        > Send </button>
    </div>
}

// message display box
const MessageBox = ({ index, msg }: {
    index: number,
    msg: { 
        username: string,
        text: string,
        timeStamp: string
    }
}) => {

    return <div key={index} className="flex flex-col bg-white rounded-md inline-block p-1 mb-1.5 w-fit">
        <div className="flex text-username font-extralight text-sky-500">
            @{msg.username}
        </div>
        <div className="flex justify-end text-xs sm:text-sm pr-1 text-gray-800">
            {msg.text} 
        </div>
        <div className="text-date font-extralight text-gray-400">
            {msg.timeStamp.substring(0, 15)} {msg.timeStamp.substring(19,22)}
        </div>
    </div>
}


export default Chat