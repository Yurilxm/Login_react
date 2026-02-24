function Input({ type, placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...props}
      className="
        w-full h-12 px-4 py-3 pr-12 rounded-lg bg-gray-700 text-white placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500"/>
  )
}

export default Input