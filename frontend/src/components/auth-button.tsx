const AuthButton = ({ text, onClick }: {
    text: string,
    onClick: () => void
}) => {
    return <button type="button" className="w-full focus:outline-none text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" onClick={onClick}>{ text }</button>

}

export default AuthButton