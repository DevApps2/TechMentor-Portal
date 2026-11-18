import { chamar } from './cliente'
import type { Parceira, Termos } from './tipos'

export interface DadosDoAceite {
    email: string
    codigo: string
    senha: string
    aceitaTermos: boolean
    versaoTermos: string
}

/** Rota pública: a parceira ainda não tem conta ativa quando lê os termos. */
export function buscarTermos() {
    return chamar<Termos>('GET', '/parceiras/termos')
}

export function aceitarConvite(dados: DadosDoAceite) {
    return chamar<Parceira>('POST', '/parceiras/convite/aceitar', dados)
}