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