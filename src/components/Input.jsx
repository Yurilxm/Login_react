function Input({ type, placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500"/>
  )
}

export default Input