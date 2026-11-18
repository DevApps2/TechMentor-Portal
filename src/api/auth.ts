import { chamar } from './cliente'
import type { LoginResposta } from './tipos'

export function login(email: string, senha: string) {
    return chamar<LoginResposta>('POST', '/usuarios/login', { email, senha })
}