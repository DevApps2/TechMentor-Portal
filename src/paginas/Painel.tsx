import { useEffect, useState } from 'react'
import { chamar } from '../api/cliente'
import type { Parceira } from '../api/tipos'
import { useSessao } from '../contexto/sessaoContexto.ts'

const AVISO: Record<Parceira['situacao'], string> = {
    CONVIDADA: 'Sua conta está em verificação pela equipe do TechMentor. Assim que for liberada, você poderá criar cursos.',
    ATIVA: 'Sua conta está ativa. Você já pode criar cursos e enviá-los para revisão.',
    SUSPENSA: 'Sua conta está suspensa. Você ainda pode consultar seus cursos, mas não pode alterá-los.',
}

export default function Painel() {
    const { sair } = useSessao()
    const [perfil, setPerfil] = useState<Parceira | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    useEffect(() => {
        let ativo = true
        chamar<Parceira>('GET', '/api/parceira/perfil')
            .then((p) => { if (ativo) setPerfil(p) })
            .catch((e) => { if (ativo) setErro(e instanceof Error ? e.message : 'Não foi possível carregar.') })
        return () => { ativo = false }
    }, [])

    return (
        <main className="pagina">
            <header className="topo">
                <h1>{perfil ? perfil.nome : 'Painel da parceira'}</h1>
                <button className="secundario" onClick={sair}>Sair</button>
            </header>

            {erro && <p className="erro" role="alert">{erro}</p>}
            {!perfil && !erro && <p className="mudo">Carregando...</p>}

            {perfil && (
                <section className="cartao">
                    <span className={`selo selo-${perfil.situacao.toLowerCase()}`}>{perfil.situacao}</span>
                    <p>{AVISO[perfil.situacao]}</p>
                    {perfil.situacao === 'SUSPENSA' && perfil.motivoDaSuspensao && (
                        <p className="erro">Motivo: {perfil.motivoDaSuspensao}</p>
                    )}
                    <p className="mudo">Cursos cadastrados: {perfil.cursos}</p>
                </section>
            )}
        </main>
    )
}