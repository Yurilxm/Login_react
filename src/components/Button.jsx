function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  )
}

export default Button