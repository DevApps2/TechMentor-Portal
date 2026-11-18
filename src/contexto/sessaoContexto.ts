import { createContext, useContext } from 'react'
import type { Usuario } from '../api/tipos'

export interface Sessao {
    usuario: Usuario | null
    entrar: (email: string, senha: string) => Promise<void>
    sair: () => void
}

export const SessaoContexto = createContext<Sessao | null>(null)

export function useSessao(): Sessao {
    const contexto = useContext(SessaoContexto)
    if (!contexto) throw new Error('useSessao precisa estar dentro do SessaoProvider')
    return contexto
}