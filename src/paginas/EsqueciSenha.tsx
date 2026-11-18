import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { mensagemDe } from '../api/mensagem'
import { pedirCodigoDeSenha, redefinirSenha } from '../api/parceira'

export default function EsqueciSenha() {
  const [etapa, setEtapa] = useState<'pedir' | 'redefinir' | 'pronto'>('pedir')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function pedir(evento: FormEvent) {
    evento.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro(null)
    try {
      // A resposta é sempre a mesma, exista ou não o e-mail: assim ninguém descobre quem tem conta.
      await pedirCodigoDeSenha(email.trim())
      setEtapa('redefinir')
    } catch (e) {
      setErro(mensagemDe(e))
    } finally {
      setEnviando(false)
    }
  }

  async function redefinir(evento: FormEvent) {
    evento.preventDefault()
    if (enviando) return
    if (senha.length < 8 || senha.length > 72) return setErro('A senha deve ter entre 8 e 72 caracteres.')
    setEnviando(true)
    setErro(null)
    try {
      await redefinirSenha(email.trim(), codigo.trim(), senha)
      setEtapa('pronto')
    } catch (e) {
      setErro(mensagemDe(e))
    } finally {
      setEnviando(false)
    }
  }

  if (etapa === 'pronto') {
    return (
      <main className="centro">
        <div className="cartao">
          <h1>Senha alterada</h1>
          <p>Já pode entrar com a senha nova.</p>
          <Link className="botao" to="/entrar">Ir para o login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="centro">
      {etapa === 'pedir' ? (
        <form className="cartao" onSubmit={pedir}>
          <h1>Esqueci minha senha</h1>
          <p className="mudo">Informe o e-mail da conta. Se ele existir, enviaremos um código de 6 dígitos, válido por 10 minutos.</p>
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button type="submit" disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar código'}</button>
          <p className="mudo"><Link to="/entrar">Voltar ao login</Link></p>
        </form>
      ) : (
        <form className="cartao" onSubmit={redefinir}>
          <h1>Criar nova senha</h1>
          <p className="mudo">Digite o código que chegou por e-mail e escolha a senha nova.</p>
          <label>
            Código de 6 dígitos
            <input value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" required />
          </label>
          <label>
            Nova senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" minLength={8} maxLength={72} required />
          </label>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button type="submit" disabled={enviando}>{enviando ? 'Salvando...' : 'Alterar senha'}</button>
          <p className="mudo">Não chegou? <button type="button" className="link" onClick={() => setEtapa('pedir')}>Pedir outro código</button></p>
        </form>
      )}
    </main>
  )
}
