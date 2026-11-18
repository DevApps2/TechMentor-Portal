import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dataBr, mensagemDe, mover } from '../api/mensagem'
import {
  apagarAula,
  apagarModulo,
  atualizarAula,
  atualizarCurso,
  criarAula,
  criarModulo,
  enviarParaRevisao,
  historicoDoCurso,
  obterCurso,
  renomearModulo,
  reordenarAulas,
  reordenarModulos,
} from '../api/parceira'
import {
  CATEGORIAS,
  NIVEIS,
  SITUACOES,
  type Aula,
  type AulaDados,
  type Categoria,
  type Curso,
  type Modulo,
  type Nivel,
} from '../api/tipos'
import { useDados } from '../hooks/useDados'

type Executar = (acao: () => Promise<unknown>, sucesso?: string) => Promise<void>

export default function CursoEditar() {
  const cursoId = Number(useParams().id)
  const curso = useDados(() => obterCurso(cursoId), [cursoId])
  const historico = useDados(() => historicoDoCurso(cursoId), [cursoId])

  const [ocupado, setOcupado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  /** Roda uma alteração, mostra o erro da API se houver e recarrega o curso. */
  const executar: Executar = async (acao, sucesso) => {
    if (ocupado) return
    setOcupado(true)
    setErro(null)
    setAviso(null)
    try {
      await acao()
      curso.recarregar()
      historico.recarregar()
      if (sucesso) setAviso(sucesso)
    } catch (e) {
      setErro(mensagemDe(e))
    } finally {
      setOcupado(false)
    }
  }

  if (curso.erro) return <p className="erro" role="alert">{curso.erro}</p>
  if (!curso.dados) return <p className="mudo">Carregando...</p>

  const c = curso.dados
  // Em revisão ou arquivado a API recusa qualquer alteração; aqui a tela já esconde os botões.
  const editavel = c.situacao === 'RASCUNHO' || c.situacao === 'PUBLICADO'

  return (
    <>
      <p><Link to="/cursos">← Voltar aos cursos</Link></p>

      <div className="topo">
        <h1>{c.titulo}</h1>
        <span className={`selo selo-${c.situacao.toLowerCase()}`}>{SITUACOES[c.situacao]}</span>
      </div>

      {c.comentarioRevisao && (
        <p className="aviso">
          <strong>Comentário da equipe do TechMentor:</strong> {c.comentarioRevisao}
        </p>
      )}
      {c.situacao === 'EM_REVISAO' && (
        <p className="aviso">Seu curso está em análise. Você será avisada da decisão e, enquanto isso, ele não pode ser editado.</p>
      )}
      {c.situacao === 'ARQUIVADO' && <p className="aviso">Este curso está arquivado e não pode mais ser editado.</p>}
      {c.situacao === 'PUBLICADO' && (
        <p className="mudo">Curso no ar. Você pode corrigir textos e links; toda alteração fica registrada no histórico.</p>
      )}

      {erro && <p className="erro" role="alert">{erro}</p>}
      {aviso && <p className="sucesso" role="status">{aviso}</p>}

      {c.situacao === 'RASCUNHO' && (
        <div className="cartao largo">
          <strong>Pronto para a revisão?</strong>
          <p className="mudo">
            O curso precisa de descrição, pelo menos um módulo e nenhum módulo vazio. A equipe analisa e responde por aviso.
          </p>
          <button
            disabled={ocupado}
            onClick={() => executar(() => enviarParaRevisao(c.id), 'Curso enviado para revisão.')}
          >
            Enviar para revisão
          </button>
        </div>
      )}

      <DadosDoCurso key={c.id} curso={c} editavel={editavel} ocupado={ocupado} executar={executar} />

      <h2>Módulos e aulas</h2>
      {c.modulos.length === 0 && <p className="mudo">Nenhum módulo ainda. Adicione o primeiro abaixo.</p>}

      {c.modulos.map((m, i) => (
        <ModuloCard
          key={m.id}
          modulo={m}
          editavel={editavel}
          ocupado={ocupado}
          executar={executar}
          aoMover={(delta) => executar(() => reordenarModulos(c.id, mover(c.modulos.map((x) => x.id), i, i + delta)))}
          primeiro={i === 0}
          ultimo={i === c.modulos.length - 1}
        />
      ))}

      {editavel && <NovoModulo cursoId={c.id} ocupado={ocupado} executar={executar} />}

      <h2>Histórico</h2>
      {historico.dados?.length === 0 && <p className="mudo">Sem registros.</p>}
      <ul className="historico">
        {historico.dados?.map((h) => (
          <li key={h.id}>
            <strong>{h.descricao}</strong>{h.detalhe ? `: ${h.detalhe}` : ''}
            <span className="mudo"> · {h.autorNome ?? 'Sistema'} · {dataBr(h.quando)}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

// ---------------------------------------------------------------- dados do curso

function DadosDoCurso({ curso, editavel, ocupado, executar }: {
  curso: Curso
  editavel: boolean
  ocupado: boolean
  executar: Executar
}) {
  const [titulo, setTitulo] = useState(curso.titulo)
  const [descricao, setDescricao] = useState(curso.descricao ?? '')
  const [categoria, setCategoria] = useState<Categoria>(curso.categoria)
  const [nivel, setNivel] = useState<Nivel>(curso.nivel ?? 'INICIANTE')

  function salvar(evento: FormEvent) {
    evento.preventDefault()
    executar(
      () => atualizarCurso(curso.id, { titulo: titulo.trim(), descricao: descricao.trim(), categoria, nivel }),
      'Dados do curso salvos.',
    )
  }

  return (
    <form className="cartao largo" onSubmit={salvar}>
      <strong>Dados do curso</strong>
      <fieldset disabled={!editavel || ocupado}>
        <label>
          Título
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={150} required />
        </label>
        <label>
          Descrição
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={1000} rows={4} />
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
        <p className="mudo">O crédito do curso é sempre o nome da sua instituição.</p>
        {editavel && <button type="submit">Salvar dados</button>}
      </fieldset>
    </form>
  )
}

// ---------------------------------------------------------------- módulos

function ModuloCard({ modulo, editavel, ocupado, executar, aoMover, primeiro, ultimo }: {
  modulo: Modulo
  editavel: boolean
  ocupado: boolean
  executar: Executar
  aoMover: (delta: number) => void
  primeiro: boolean
  ultimo: boolean
}) {
  const [editandoTitulo, setEditandoTitulo] = useState(false)
  const [titulo, setTitulo] = useState(modulo.titulo)
  const [novaAula, setNovaAula] = useState(false)

  return (
    <section className="cartao largo modulo">
      <div className="topo">
        {editandoTitulo ? (
          <form
            className="linha"
            onSubmit={(e) => {
              e.preventDefault()
              executar(() => renomearModulo(modulo.id, titulo.trim()))
              setEditandoTitulo(false)
            }}
          >
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={150} required />
            <button type="submit" disabled={ocupado}>Salvar</button>
          </form>
        ) : (
          <strong>{modulo.ordem}. {modulo.titulo}</strong>
        )}

        {editavel && (
          <div className="acoes">
            <button className="mini" disabled={ocupado || primeiro} onClick={() => aoMover(-1)} aria-label="Subir módulo">↑</button>
            <button className="mini" disabled={ocupado || ultimo} onClick={() => aoMover(1)} aria-label="Descer módulo">↓</button>
            <button className="mini" disabled={ocupado} onClick={() => setEditandoTitulo((v) => !v)}>Renomear</button>
            <button
              className="mini perigo"
              disabled={ocupado}
              onClick={() => window.confirm(`Apagar o módulo "${modulo.titulo}" e suas aulas?`) && executar(() => apagarModulo(modulo.id))}
            >
              Apagar
            </button>
          </div>
        )}
      </div>

      {modulo.aulas.length === 0 && <p className="mudo">Módulo sem aulas. Adicione pelo menos uma.</p>}

      {modulo.aulas.map((a, i) => (
        <AulaLinha
          key={a.id}
          aula={a}
          editavel={editavel}
          ocupado={ocupado}
          executar={executar}
          primeira={i === 0}
          ultima={i === modulo.aulas.length - 1}
          aoMover={(delta) => executar(() => reordenarAulas(modulo.id, mover(modulo.aulas.map((x) => x.id), i, i + delta)))}
        />
      ))}

      {editavel && (novaAula ? (
        <FormAula
          ocupado={ocupado}
          aoSalvar={(dados) => executar(() => criarAula(modulo.id, dados), 'Aula adicionada.').then(() => setNovaAula(false))}
          aoCancelar={() => setNovaAula(false)}
        />
      ) : (
        <button className="secundario" onClick={() => setNovaAula(true)}>+ Adicionar aula</button>
      ))}
    </section>
  )
}

function NovoModulo({ cursoId, ocupado, executar }: { cursoId: number; ocupado: boolean; executar: Executar }) {
  const [titulo, setTitulo] = useState('')

  return (
    <form
      className="cartao largo linha"
      onSubmit={(e) => {
        e.preventDefault()
        executar(() => criarModulo(cursoId, titulo.trim()), 'Módulo adicionado.')
        setTitulo('')
      }}
    >
      <input placeholder="Título do novo módulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={150} required />
      <button type="submit" disabled={ocupado}>Adicionar módulo</button>
    </form>
  )
}

// ---------------------------------------------------------------- aulas

function AulaLinha({ aula, editavel, ocupado, executar, primeira, ultima, aoMover }: {
  aula: Aula
  editavel: boolean
  ocupado: boolean
  executar: Executar
  primeira: boolean
  ultima: boolean
  aoMover: (delta: number) => void
}) {
  const [editando, setEditando] = useState(false)

  if (editando) {
    return (
      <FormAula
        inicial={aula}
        ocupado={ocupado}
        aoSalvar={(dados) => executar(() => atualizarAula(aula.id, dados), 'Aula salva.').then(() => setEditando(false))}
        aoCancelar={() => setEditando(false)}
      />
    )
  }

  return (
    <div className="aula">
      <div>
        <strong>{aula.ordem}. {aula.titulo}</strong>
        <p className="mudo">{aula.duracaoMinutos} min · {aula.xpRecompensa} XP{aula.conteudoUrl ? '' : ' · sem vídeo'}</p>
      </div>
      {editavel && (
        <div className="acoes">
          <button className="mini" disabled={ocupado || primeira} onClick={() => aoMover(-1)} aria-label="Subir aula">↑</button>
          <button className="mini" disabled={ocupado || ultima} onClick={() => aoMover(1)} aria-label="Descer aula">↓</button>
          <button className="mini" disabled={ocupado} onClick={() => setEditando(true)}>Editar</button>
          <button
            className="mini perigo"
            disabled={ocupado}
            onClick={() => window.confirm(`Apagar a aula "${aula.titulo}"?`) && executar(() => apagarAula(aula.id))}
          >
            Apagar
          </button>
        </div>
      )}
    </div>
  )
}

function FormAula({ inicial, ocupado, aoSalvar, aoCancelar }: {
  inicial?: Aula
  ocupado: boolean
  aoSalvar: (dados: AulaDados) => void
  aoCancelar: () => void
}) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '')
  const [duracao, setDuracao] = useState(String(inicial?.duracaoMinutos ?? 10))
  const [xp, setXp] = useState(inicial ? String(inicial.xpRecompensa) : '')
  const [link, setLink] = useState(inicial?.conteudoUrl ?? '')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    aoSalvar({
      titulo: titulo.trim(),
      duracaoMinutos: Math.max(0, Number(duracao) || 0),
      xpRecompensa: xp.trim() === '' ? null : Math.max(0, Number(xp) || 0),
      conteudoUrl: link.trim() === '' ? null : link.trim(),
    })
  }

  return (
    <form className="formaula" onSubmit={enviar}>
      <label>
        Título da aula
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={200} required />
      </label>
      <div className="linha">
        <label>
          Duração (min)
          <input type="number" min={0} value={duracao} onChange={(e) => setDuracao(e.target.value)} required />
        </label>
        <label>
          XP (opcional)
          <input type="number" min={0} value={xp} onChange={(e) => setXp(e.target.value)} />
        </label>
      </div>
      <label>
        Link do vídeo
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." maxLength={255} />
        <span className="mudo">YouTube (watch?v=ID ou youtu.be/ID) ou um arquivo .mp4 em https.</span>
      </label>
      <div className="linha">
        <button type="submit" disabled={ocupado}>Salvar aula</button>
        <button type="button" className="secundario" onClick={aoCancelar}>Cancelar</button>
      </div>
    </form>
  )
}
