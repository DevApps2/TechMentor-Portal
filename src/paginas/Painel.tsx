import { Link } from 'react-router-dom'
import { perfil } from '../api/parceira'
import type { Parceira } from '../api/tipos'
import { useDados } from '../hooks/useDados'

const AVISO: Record<Parceira['situacao'], string> = {
  CONVIDADA: 'Sua conta está em verificação pela equipe do TechMentor. Assim que for liberada, você poderá criar cursos.',
  ATIVA: 'Sua conta está ativa. Você já pode criar cursos e enviá-los para revisão.',
  SUSPENSA: 'Sua conta está suspensa. Você ainda pode consultar seus cursos, mas não pode alterá-los.',
}

/** Início: a situação da conta e atalhos. */
export default function Painel() {
  const eu = useDados(perfil)

  return (
    <>
      <h1>{eu.dados ? eu.dados.nome : 'Início'}</h1>

      {eu.erro && <p className="erro" role="alert">{eu.erro}</p>}
      {eu.carregando && <p className="mudo">Carregando...</p>}

      {eu.dados && (
        <section className="cartao largo">
          <span className={`selo selo-${eu.dados.situacao.toLowerCase()}`}>{eu.dados.situacao}</span>
          <p>{AVISO[eu.dados.situacao]}</p>
          {eu.dados.situacao === 'SUSPENSA' && eu.dados.motivoDaSuspensao && (
            <p className="erro">Motivo: {eu.dados.motivoDaSuspensao}</p>
          )}
          <p className="mudo">Cursos cadastrados: {eu.dados.cursos}</p>
          <div className="linha">
            <Link className="botao" to="/cursos">Ver meus cursos</Link>
            <Link className="botao claro" to="/metricas">Ver números</Link>
          </div>
        </section>
      )}
    </>
  )
}
