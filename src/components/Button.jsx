function Button({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`
        w-full py-3 rounded-lg font-semibold text-white transition
        bg-blue-600
        ${disabled 
          ? 'opacity-80 cursor-not-allowed'
          : 'hover:bg-blue-700 hover:-translate-y-0.5'
        }
      `}
    >
      {children}
    </button>
  )
}

export default Button