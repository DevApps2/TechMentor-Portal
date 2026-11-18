import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { login } from '../api/auth'
import { aoSessaoExpirar, definirToken, ErroDaApi, lerToken } from '../api/cliente'
import type { Usuario } from '../api/tipos'
import { SessaoContexto } from './sessaoContexto.ts'

function lerUsuarioSalvo(): Usuario | null {
    try {
        const texto = sessionStorage.getItem('usuario')
        return texto && lerToken() ? (JSON.parse(texto) as Usuario) : null
    } catch {
        return null
    }
}

export function SessaoProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(lerUsuarioSalvo)

    const sair = useCallback(() => {
        definirToken(null)
        sessionStorage.removeItem('usuario')
        setUsuario(null)
    }, [])

    // Se a API responder 401 (token vencido), a sessão é encerrada e a rota protegida leva ao login.
    useEffect(() => {
        aoSessaoExpirar(sair)
    }, [sair])

    async function entrar(email: string, senha: string) {
        const resposta = await login(email, senha)

        // O portal é só das empresas parceiras: outros tipos de conta não ficam logados aqui.
        if (resposta.usuario.tipo !== 'PARCEIRA') {
            throw new ErroDaApi(403, 'Esta área é só para empresas parceiras. Alunas e mentoras usam o aplicativo.')
        }

        definirToken(resposta.accessToken)
        sessionStorage.setItem('usuario', JSON.stringify(resposta.usuario))
        setUsuario(resposta.usuario)
    }

    return <SessaoContexto.Provider value={{ usuario, entrar, sair }}>{children}</SessaoContexto.Provider>
}