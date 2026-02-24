import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Input from "./Input"
import Button from "./Button"

function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState("")

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEsc)
        return () => document.removeEventListener("keydown", handleEsc)
    }, [onClose])

    function handleSubmit() {
        if (!email) {
            toast.error("Preencha o campo de email")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error("Digite um email válido")
            return
        }

        toast.success("Email de recuperação enviado!")
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-sm backdrop-blur-sm bg-white/10 p-6 rounded-lg shadow-lg z-10">
                <h2 className="text-xl font-bold mb-4 text-center text-white">
                    Recuperar senha
                </h2>

                <p className="text-sm text-gray-300 mb-4 text-center">
                    Digite seu email para receber as instruções de recuperação.
                </p>

                <Input
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="h-4" />

                <Button onClick={handleSubmit} className="w-full">
                    Enviar email de recuperação
                </Button>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                    title="Fechar"
                >
                    <i className="ri-close-line text-xl" />
                </button>
            </div>
        </div>
    )
}

export default ForgotPasswordModal