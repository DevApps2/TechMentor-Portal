import { Link } from 'react-router-dom'
import { listarCursos, perfil } from '../api/parceira'
import type { Parceira } from '../api/tipos'
import Esqueleto from '../componentes/Esqueleto'
import { useDados } from '../hooks/useDados'

const AVISO: Record<Parceira['situacao'], string> = {
  CONVIDADA: 'Sua conta está em verificação pela equipe do TechMentor. Assim que for liberada, você poderá criar cursos.',
  ATIVA: 'Sua conta está ativa. Crie seus cursos, envie para revisão e acompanhe os resultados por aqui.',
  SUSPENSA: 'Sua conta está suspensa. Você ainda pode consultar seus cursos, mas não pode alterá-los.',
}

const SITUACAO: Record<Parceira['situacao'], string> = {
  CONVIDADA: 'EM VERIFICAÇÃO',
  ATIVA: 'CONTA ATIVA',
  SUSPENSA: 'CONTA SUSPENSA',
}

/** Início: boas-vindas, situação da conta, resumo dos cursos e os próximos passos. */
export default function Painel() {
  const eu = useDados(perfil)
  const cursos = useDados(listarCursos)

  if (eu.erro) return <p className="erro" role="alert">{eu.erro}</p>
  if (!eu.dados) return <Esqueleto linhas={2} altura={140} />

  const conta = eu.dados
  const lista = cursos.dados ?? []
  const publicados = lista.filter((c) => c.situacao === 'PUBLICADO').length
  const emRevisao = lista.filter((c) => c.situacao === 'EM_REVISAO').length
  const rascunhos = lista.filter((c) => c.situacao === 'RASCUNHO').length

  const passos = [
    { titulo: 'Conta verificada pela equipe', texto: 'A equipe confere os dados da sua instituição.', feito: conta.situacao !== 'CONVIDADA' },
    { titulo: 'Criar o primeiro curso', texto: 'Monte módulos e aulas com os links dos seus vídeos.', feito: lista.length > 0 },
    { titulo: 'Enviar para revisão', texto: 'A equipe analisa e responde por aviso.', feito: lista.some((c) => c.situacao !== 'RASCUNHO') },
    { titulo: 'Curso publicado', texto: 'Aparece para as alunas com o crédito da sua instituição.', feito: publicados > 0 },
  ]
  const atual = passos.findIndex((p) => !p.feito)

  return (
    <>
      <section className="hero">
        <small>Bem-vinda</small>
        <h1>{conta.nome}</h1>
        <span className={`selo selo-${conta.situacao.toLowerCase()}`}>{SITUACAO[conta.situacao]}</span>
        <p>{AVISO[conta.situacao]}</p>
        {conta.situacao === 'SUSPENSA' && conta.motivoDaSuspensao && <p>Motivo: {conta.motivoDaSuspensao}</p>}
        <div className="linha">
          <Link className="botao" to="/cursos">Ver meus cursos</Link>
          <Link className="botao claro" to="/metricas">Ver números</Link>
        </div>
      </section>

      <div className="numeros">
        <div className="numero"><strong>{publicados}</strong><span>cursos publicados</span></div>
        <div className="numero"><strong>{emRevisao}</strong><span>em revisão</span></div>
        <div className="numero"><strong>{rascunhos}</strong><span>rascunhos</span></div>
      </div>

      <h2>Primeiros passos</h2>
      <section className="cartao">
        <ol className="passos">
          {passos.map((p, i) => (
            <li key={p.titulo} className={p.feito ? 'feito' : i === atual ? 'atual' : ''}>
              <span className="passo-marca">{p.feito ? '✓' : i + 1}</span>
              <div>
                <strong>{p.titulo}</strong>
                <span className="mudo">{p.texto}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
