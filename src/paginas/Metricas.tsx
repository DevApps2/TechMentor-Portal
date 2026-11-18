import { useState } from 'react'
import { listarCursos, metricasDoCurso } from '../api/parceira'
import { SITUACOES } from '../api/tipos'
import { useDados } from '../hooks/useDados'
import Esqueleto from '../componentes/Esqueleto'
import EstadoVazio from '../componentes/EstadoVazio'

export default function Metricas() {
  const cursos = useDados(listarCursos)
  const [escolhido, setEscolhido] = useState<number | null>(null)

  // Sem escolha, mostra o primeiro curso da lista.
  const cursoId = escolhido ?? cursos.dados?.[0]?.id ?? null

  return (
    <>
      <h1>Números dos cursos</h1>
      <p className="mudo">Dados agregados. Nenhuma aluna é identificada.</p>

      {cursos.erro && <p className="erro" role="alert">{cursos.erro}</p>}
      {cursos.carregando && <Esqueleto linhas={2} />}
      {cursos.dados?.length === 0 && (
        <EstadoVazio icone="numeros" titulo="Ainda não há números" texto="Quando suas alunas começarem a estudar, os resultados aparecem aqui." />
      )}

      {cursos.dados && cursos.dados.length > 0 && (
        <label className="seletor">
          Curso
          <select value={cursoId ?? ''} onChange={(e) => setEscolhido(Number(e.target.value))}>
            {cursos.dados.map((c) => (
              <option key={c.id} value={c.id}>{c.titulo} ({SITUACOES[c.situacao]})</option>
            ))}
          </select>
        </label>
      )}

      {cursoId !== null && <NumerosDoCurso key={cursoId} cursoId={cursoId} />}
    </>
  )
}

function NumerosDoCurso({ cursoId }: { cursoId: number }) {
  const metricas = useDados(() => metricasDoCurso(cursoId), [cursoId])

  if (metricas.erro) return <p className="erro" role="alert">{metricas.erro}</p>
  if (!metricas.dados) return <Esqueleto linhas={2} altura={90} />

  const m = metricas.dados

  return (
    <>
      <div className="numeros">
        <div className="numero"><strong>{m.matriculas}</strong><span>matriculadas</span></div>
        <div className="numero"><strong>{m.alunasComProgresso}</strong><span>começaram a estudar</span></div>
        <div className="numero"><strong>{m.concluintes}</strong><span>concluíram</span></div>
        <div className="numero"><strong>{m.taxaConclusao}%</strong><span>taxa de conclusão</span></div>
      </div>

      {m.aulaOndeMaisPararam && (
        <p className="aviso">
          Onde mais alunas pararam: depois da aula <strong>{m.aulaOndeMaisPararam.titulo}</strong>
          {' '}({m.alunasQuePararam} {m.alunasQuePararam === 1 ? 'aluna' : 'alunas'}). Vale revisar a aula seguinte.
        </p>
      )}

      {m.aulas.length > 0 && (
        <table className="tabela">
          <thead>
            <tr><th>Módulo</th><th>Aula</th><th>Título</th><th>Concluíram</th></tr>
          </thead>
          <tbody>
            {m.aulas.map((a) => (
              <tr key={a.aulaId}>
                <td>{a.ordemModulo}</td>
                <td>{a.ordemAula}</td>
                <td>{a.titulo}</td>
                <td>{a.concluiram}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
