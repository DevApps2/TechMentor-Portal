// Todo pedido à API passa por aqui: coloca o token, trata os erros e avisa quando a sessão expira.

const URL_BASE = import.meta.env.VITE_API_URL as string

/** Erro devolvido pela API no formato { erro, codigo, campos }. */
export class ErroDaApi extends Error {
    status: number
    campos?: Record<string, string>

    constructor(status: number, mensagem: string, campos?: Record<string, string>) {
        super(mensagem)
        this.status = status
        this.campos = campos
    }
}

// O token fica no sessionStorage: some quando a aba fecha e não é lido por outros sites.
let token: string | null = sessionStorage.getItem('token')
let aoExpirar: (() => void) | null = null

export function definirToken(novo: string | null) {
    token = novo
    if (novo) sessionStorage.setItem('token', novo)
    else sessionStorage.removeItem('token')
}

export function lerToken() {
    return token
}

/** A tela de sessão registra aqui o que fazer quando a API responder 401 (token vencido). */
export function aoSessaoExpirar(funcao: () => void) {
    aoExpirar = funcao
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function chamar<T>(metodo: Metodo, caminho: string, corpo?: unknown): Promise<T> {
    const cabecalhos: Record<string, string> = {
        // evita a página de aviso que o túnel ngrok mostra para navegadores
        'ngrok-skip-browser-warning': '1',
    }
    if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'
    if (token) cabecalhos['Authorization'] = `Bearer ${token}`

    let resposta: Response
    try {
        resposta = await fetch(`${URL_BASE}${caminho}`, {
            method: metodo,
            headers: cabecalhos,
            body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
        })
    } catch {
        throw new ErroDaApi(0, 'Não foi possível conectar ao servidor. Confira sua internet e tente de novo.')
    }

    if (resposta.status === 204) return undefined as T

    const dados = lerJson(await resposta.text())

    if (!resposta.ok) {
        const corpoDoErro = (dados ?? {}) as { erro?: string; campos?: Record<string, string> }

        // 401 com token = sessão vencida. Sem token (ex.: senha errada no login) não derruba nada.
        if (resposta.status === 401 && token) {
            definirToken(null)
            aoExpirar?.()
        }
        throw new ErroDaApi(resposta.status, corpoDoErro.erro ?? 'Algo deu errado. Tente de novo.', corpoDoErro.campos)
    }

    return dados as T
}

/** Lê o corpo da resposta como JSON; se vier vazio ou não for JSON, devolve null. */
function lerJson(texto: string): unknown {
    if (!texto) return null
    try {
        return JSON.parse(texto)
    } catch {
        return null
    }
}