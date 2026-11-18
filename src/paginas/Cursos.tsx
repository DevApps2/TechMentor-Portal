import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mensagemDe } from '../api/mensagem'
import { criarCurso, listarCursos, perfil } from '../api/parceira'
import { CATEGORIAS, NIVEIS, SITUACOES, type Categoria, type Nivel } from '../api/tipos'
import { useDados } from '../hooks/useDados'

export default function Cursos() {
  const navegar = useNavigate()
  const cursos = useDados(listarCursos)
  const eu = useDados(perfil)

  const [criando, setCriando] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('PROGRAMACAO')
  const [nivel, setNivel] = useState<Nivel>('INICIANTE')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const podeCriar = eu.dados?.situacao === 'ATIVA'

  async function criar(evento: FormEvent) {
    evento.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro(null)
    try {
      const novo = await criarCurso({ titulo: titulo.trim(), descricao: descricao.trim(), categoria, nivel })
      navegar(`/cursos/${novo.id}`)
    } catch (e) {
      setErro(mensagemDe(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="topo">
        <h1>Seus cursos</h1>
        <button onClick={() => setCriando((v) => !v)} disabled={!podeCriar}>
          {criando ? 'Fechar' : 'Novo curso'}
        </button>
      </div>

      {eu.dados && !podeCriar && (
        <p className="aviso">
          {eu.dados.situacao === 'SUSPENSA'
            ? 'Sua conta está suspensa: você pode consultar os cursos, mas não criar nem alterar.'
            : 'Sua conta ainda está em verificação. Você poderá criar cursos assim que a equipe liberar.'}
        </p>
      )}

      {criando && (
        <form className="cartao largo" onSubmit={criar}>
          <label>
            Título do curso
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={150} required />
          </label>
          <label>
            Descrição
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={1000} rows={4} required />
          </label>
          <div className="linha">
            <label>
              Categoria
              <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
                {Object.entries(CATEGORIAS).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
              </select>
            </label>
            <label>
              Nível
              <select value={nivel} onChange={(e) => setNivel(e.target.value as Nivel)}>
                {Object.entries(NIVEIS).map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
              </select>
            </label>
          </div>
          {erro && <p className="erro" role="alert">{erro}</p>}
          <button type="submit" disabled={enviando}>{enviando ? 'Criando...' : 'Criar e adicionar aulas'}</button>
        </form>
      )}

      {cursos.erro && <p className="erro" role="alert">{cursos.erro}</p>}
      {cursos.carregando && <p className="mudo">Carregando...</p>}
      {cursos.dados && cursos.dados.length === 0 && (
        <p className="mudo">Você ainda não tem cursos. Crie o primeiro com o botão "Novo curso".</p>
      )}

      <div className="lista">
        {cursos.dados?.map((c) => (
          <Link key={c.id} to={`/cursos/${c.id}`} className="cartao largo item">
            <div>
              <strong>{c.titulo}</strong>
              <p className="mudo">
                {CATEGORIAS[c.categoria]} · {c.modulos.length} módulos · {c.totalAulas ?? 0} aulas
              </p>
              {c.comentarioRevisao && <p className="erro">Comentário da equipe: {c.comentarioRevisao}</p>}
            </div>
            <span className={`selo selo-${c.situacao.toLowerCase()}`}>{SITUACOES[c.situacao]}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
