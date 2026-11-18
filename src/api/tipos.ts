export type TipoUsuario = 'ALUNA' | 'MENTORA' | 'ADMIN' | 'PARCEIRA'

export interface Usuario {
    id: number
    nome: string
    email: string
    fotoUrl: string | null
    tipo: TipoUsuario
}

export interface LoginResposta {
    usuario: Usuario
    accessToken: string
    tokenType: string
    expiresIn: number
    precisaTrocarSenha: boolean
}

export type SituacaoParceira = 'CONVIDADA' | 'ATIVA' | 'SUSPENSA'

export interface Checklist {
    siteConferido: boolean
    dominioDoEmailConferido: boolean
    identificacaoConferida: boolean
    verificadaEm: string | null
    verificadaPor: string | null
    observacao: string | null
}

export interface Parceira {
    id: number
    usuarioId: number
    nome: string
    tipo: 'EMPRESA' | 'ONG' | 'INDEPENDENTE'
    documento: string | null
    site: string | null
    responsavel: string
    email: string
    situacao: SituacaoParceira
    criadaEm: string
    aceitouOsTermos: boolean
    termosVersao: string | null
    termosAceitosEm: string | null
    dominioDoEmailConfereComSite: boolean | null
    verificacao: Checklist
    motivoDaSuspensao: string | null
    cursos: number
}

export interface Termos {
    versao: string
    titulo: string
    texto: string
}
export type SituacaoCurso = 'RASCUNHO' | 'EM_REVISAO' | 'PUBLICADO' | 'ARQUIVADO'
export type Categoria = 'PROGRAMACAO' | 'DADOS' | 'DESIGN' | 'CARREIRA' | 'OUTROS' | 'SEGURANCA' | 'IA' | 'REDES'
export type Nivel = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO'

export interface Aula {
  id: number
  titulo: string
  ordem: number
  duracaoMinutos: number
  xpRecompensa: number
  conteudoUrl: string | null
}

export interface Modulo {
  id: number
  titulo: string
  ordem: number
  aulas: Aula[]
}

export interface Curso {
  id: number
  titulo: string
  descricao: string | null
  categoria: Categoria
  nivel: Nivel | null
  iconeUrl: string | null
  ativo: boolean
  instituicao: string | null
  situacao: SituacaoCurso
  totalAulas: number | null
  duracaoTotalMinutos: number
  xpTotal: number
  modulos: Modulo[]
  parceiraId?: number
  comentarioRevisao?: string
}

/** O que a parceira preenche ao criar ou editar os dados do curso. */
export interface CursoDados {
  titulo: string
  descricao: string
  categoria: Categoria
  nivel: Nivel | null
}

export interface AulaDados {
  titulo: string
  duracaoMinutos: number
  xpRecompensa: number | null
  conteudoUrl: string | null
}

export interface AulaMetrica {
  aulaId: number
  ordemModulo: number
  ordemAula: number
  titulo: string
  concluiram: number
}

export interface Metricas {
  cursoId: number
  titulo: string
  situacao: SituacaoCurso
  matriculas: number
  alunasComProgresso: number
  concluintes: number
  taxaConclusao: number
  aulas: AulaMetrica[]
  aulaOndeMaisPararam: AulaMetrica | null
  alunasQuePararam: number
}

export interface Historico {
  id: number
  quando: string
  autorNome: string | null
  autorPapel: string | null
  acao: string
  descricao: string
  detalhe: string | null
}

export interface Notificacao {
  id: number
  titulo: string
  mensagem: string
  tipo: string | null
  destino: string | null
  referencia: string | null
  lida: boolean
  criadaEm: string | null
}

export const CATEGORIAS: Record<Categoria, string> = {
  PROGRAMACAO: 'Programação',
  DADOS: 'Dados',
  DESIGN: 'Design',
  CARREIRA: 'Carreira',
  SEGURANCA: 'Segurança',
  IA: 'Inteligência artificial',
  REDES: 'Redes',
  OUTROS: 'Outros',
}

export const NIVEIS: Record<Nivel, string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
}

export const SITUACOES: Record<SituacaoCurso, string> = {
  RASCUNHO: 'Rascunho',
  EM_REVISAO: 'Em revisão',
  PUBLICADO: 'Publicado',
  ARQUIVADO: 'Arquivado',
}
