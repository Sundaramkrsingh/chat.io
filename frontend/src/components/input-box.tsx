const InputBox = ({ text, type, placeholder, value, onChange }: {
    text: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: string) => void
  }) => {
  
    return <div>
        <label htmlFor="input-label" className="block text-xs md:text-sm font-sans font-medium ml-1 mb-1 mt-3 text-gray-500">{ text }</label>
        <input type={ type } className="py-2 px-4 block w-full border border-gray-300 rounded-lg text-sm font-sans focus:border-gray-600 focus:ring-gray-600 focus:ring-1 hover:border-1.5 hover:shadow-sm hover:border-gray-600 focus:shadow-md outline-none" placeholder={ placeholder } value={ value } onChange={e => onChange(e.target.value)} />
    </div>
  }
  
  export default InputBox