import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ErroDaApi } from '../api/cliente'
import { useSessao } from '../contexto/sessaoContexto.ts'

export default function Login() {
    const { usuario, entrar } = useSessao()
    const navegar = useNavigate()
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState<string | null>(null)
    const [enviando, setEnviando] = useState(false)

    if (usuario) return <Navigate to="/" replace />

    async function enviar(evento: FormEvent) {
        evento.preventDefault()
        if (enviando) return
        setEnviando(true)
        setErro(null)
        try {
            await entrar(email.trim(), senha)
            navegar('/', { replace: true })
        } catch (e) {
            setErro(e instanceof ErroDaApi ? e.message : 'Não foi possível entrar. Tente de novo.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className="centro">
            <form className="cartao" onSubmit={enviar}>
                <h1>TechMentor para parceiras</h1>
                <p className="mudo">Entre para gerenciar os cursos da sua instituição.</p>

                <label>
                    E-mail
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
                </label>

                <label>
                    Senha
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required />
                </label>

                {erro && <p className="erro" role="alert">{erro}</p>}

                <button type="submit" disabled={enviando}>{enviando ? 'Entrando...' : 'Entrar'}</button>

                <p className="mudo"><Link to="/esqueci-senha">Esqueci minha senha</Link></p>
        <p className="mudo">Recebeu um convite? <Link to="/convite">Criar minha senha</Link></p>
            </form>
        </main>
    )
}