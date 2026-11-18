import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErroDaApi } from '../api/cliente'
import { aceitarConvite, buscarTermos } from '../api/convite'
import type { Termos } from '../api/tipos'
import TelaDeEntrada from '../componentes/TelaDeEntrada'

export default function AceitarConvite() {
    const [params, setParams] = useSearchParams()

    // Lidos só na primeira vez (veja a explicação do valor inicial preguiçoso)
    const [email, setEmail] = useState(() => params.get('email') ?? '')
    const [codigo, setCodigo] = useState(() => params.get('codigo') ?? '')
    const [senha, setSenha] = useState('')
    const [confirmacao, setConfirmacao] = useState('')
    const [aceito, setAceito] = useState(false)

    const [termos, setTermos] = useState<Termos | null>(null)
    const [erroTermos, setErroTermos] = useState<string | null>(null)

    const [erro, setErro] = useState<string | null>(null)
    const [campos, setCampos] = useState<Record<string, string>>({})
    const [enviando, setEnviando] = useState(false)
    const [concluido, setConcluido] = useState(false)

    // Depois de ler, tira e-mail e código do endereço (e do histórico do navegador).
    useEffect(() => {
        if (params.has('email') || params.has('codigo')) setParams({}, { replace: true })
    }, [params, setParams])

    useEffect(() => {
        let ativo = true
        buscarTermos()
            .then((t) => { if (ativo) setTermos(t) })
            .catch((e) => { if (ativo) setErroTermos(e instanceof Error ? e.message : 'Não foi possível carregar os termos.') })
        return () => { ativo = false }
    }, [])

    async function enviar(evento: FormEvent) {
        evento.preventDefault()
        if (enviando || !termos) return

        if (senha.length < 8 || senha.length > 72) return setErro('A senha deve ter entre 8 e 72 caracteres.')
        if (senha !== confirmacao) return setErro('As duas senhas precisam ser iguais.')
        if (!aceito) return setErro('Para continuar, aceite os Termos de Parceria.')

        setEnviando(true)
        setErro(null)
        setCampos({})
        try {
            await aceitarConvite({
                email: email.trim(),
                codigo: codigo.trim(),
                senha,
                aceitaTermos: true,
                versaoTermos: termos.versao,
            })
            setConcluido(true)
        } catch (e) {
            if (e instanceof ErroDaApi) {
                setErro(e.message)
                setCampos(e.campos ?? {})
            } else {
                setErro('Não foi possível concluir. Tente de novo.')
            }
        } finally {
            setEnviando(false)
        }
    }

    if (concluido) {
        return (
            <TelaDeEntrada>
                <div className="cartao">
                    <h1>Convite aceito!</h1>
                    <p>
                        Sua senha foi criada e os termos ficaram registrados. A equipe do TechMentor vai conferir os dados da
                        sua instituição e liberar a criação de cursos.
                    </p>
                    <Link className="botao" to="/entrar">Ir para o login</Link>
                </div>
            </TelaDeEntrada>
        )
    }

    return (
        <TelaDeEntrada>
            <form className="cartao" onSubmit={enviar}>
                <h1>Criar minha senha</h1>
                <p className="mudo">Use o código que enviamos por e-mail para ativar o acesso da sua instituição.</p>

                <label>
                    E-mail
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
                    {campos.email && <span className="erro">{campos.email}</span>}
                </label>

                <label>
                    Código do convite
                    <input value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="XXXX-XXXX" autoComplete="off" required />
                    {campos.codigo && <span className="erro">{campos.codigo}</span>}
                </label>

                <label>
                    Nova senha
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" minLength={8} maxLength={72} required />
                    <span className="mudo">Entre 8 e 72 caracteres.</span>
                    {campos.senha && <span className="erro">{campos.senha}</span>}
                </label>

                <label>
                    Repita a senha
                    <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} autoComplete="new-password" required />
                </label>

                {termos && (
                    <>
                        <strong>{termos.titulo}</strong>
                        <div className="termos" tabIndex={0} aria-label="Texto dos termos de parceria">{termos.texto}</div>
                        <label className="marcar">
                            <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
                            Li e aceito os Termos de Parceria (versão {termos.versao}).
                        </label>
                    </>
                )}
                {!termos && !erroTermos && <p className="mudo">Carregando os termos...</p>}
                {erroTermos && <p className="erro" role="alert">{erroTermos}</p>}

                {erro && <p className="erro" role="alert">{erro}</p>}

                <button type="submit" disabled={enviando || !termos}>{enviando ? 'Criando...' : 'Criar senha e aceitar'}</button>
                <p className="mudo">Já tem senha? <Link to="/entrar">Entrar</Link></p>
            </form>
        </TelaDeEntrada>
    )
}