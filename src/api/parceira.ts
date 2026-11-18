import { chamar } from './cliente'
import type {
  Aula,
  AulaDados,
  Curso,
  CursoDados,
  Historico,
  Metricas,
  Modulo,
  Notificacao,
  Parceira,
} from './tipos'

// Todas as chamadas da área da parceira. As telas só usam estas funções, nunca o fetch direto.

export const perfil = () => chamar<Parceira>('GET', '/api/parceira/perfil')

// ---- cursos ----
export const listarCursos = () => chamar<Curso[]>('GET', '/api/parceira/cursos')
export const obterCurso = (id: number) => chamar<Curso>('GET', `/api/parceira/cursos/${id}`)
export const criarCurso = (dados: CursoDados) => chamar<Curso>('POST', '/api/parceira/cursos', dados)
export const atualizarCurso = (id: number, dados: CursoDados) => chamar<Curso>('PUT', `/api/parceira/cursos/${id}`, dados)
export const enviarParaRevisao = (id: number) => chamar<Curso>('POST', `/api/parceira/cursos/${id}/revisao`)
export const metricasDoCurso = (id: number) => chamar<Metricas>('GET', `/api/parceira/cursos/${id}/metricas`)
export const historicoDoCurso = (id: number) => chamar<Historico[]>('GET', `/api/parceira/cursos/${id}/historico`)

// ---- módulos ----
export const criarModulo = (cursoId: number, titulo: string) =>
  chamar<Modulo>('POST', `/api/parceira/cursos/${cursoId}/modulos`, { titulo })
export const renomearModulo = (id: number, titulo: string) => chamar<Modulo>('PUT', `/api/parceira/modulos/${id}`, { titulo })
export const apagarModulo = (id: number) => chamar<void>('DELETE', `/api/parceira/modulos/${id}`)
export const reordenarModulos = (cursoId: number, ids: number[]) =>
  chamar<Curso>('PUT', `/api/parceira/cursos/${cursoId}/modulos/ordem`, { ids })

// ---- aulas ----
export const criarAula = (moduloId: number, dados: AulaDados) =>
  chamar<Aula>('POST', `/api/parceira/modulos/${moduloId}/aulas`, dados)
export const atualizarAula = (id: number, dados: AulaDados) => chamar<Aula>('PUT', `/api/parceira/aulas/${id}`, dados)
export const apagarAula = (id: number) => chamar<void>('DELETE', `/api/parceira/aulas/${id}`)
export const reordenarAulas = (moduloId: number, ids: number[]) =>
  chamar<Modulo>('PUT', `/api/parceira/modulos/${moduloId}/aulas/ordem`, { ids })

// ---- notificações (rotas de toda conta) ----
export const listarNotificacoes = (usuarioId: number) =>
  chamar<Notificacao[]>('GET', `/notificacoes/usuarios/${usuarioId}`)
export const marcarLidas = (usuarioId: number, id?: number) =>
  chamar<void>('PATCH', `/notificacoes/leitura/usuarios/${usuarioId}${id ? `?id=${id}` : ''}`)

// ---- senha ----
export const pedirCodigoDeSenha = (email: string) => chamar<void>('POST', '/usuarios/senha/esqueci', { email })
export const redefinirSenha = (email: string, codigo: string, novaSenha: string) =>
  chamar<void>('POST', '/usuarios/senha/redefinir', { email, codigo, novaSenha })
