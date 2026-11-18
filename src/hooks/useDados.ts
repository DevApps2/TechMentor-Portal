import { useEffect, useState } from 'react'
import { mensagemDe } from '../api/mensagem'

/**
 * Busca um dado da API ao abrir a tela. Devolve o dado, o erro (se houver) e `recarregar()`.
 * `carregando` é verdadeiro até chegar a primeira resposta.
 */
export function useDados<T>(buscar: () => Promise<T>, dependencias: unknown[] = []) {
  const [dados, setDados] = useState<T | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    buscar()
      .then((resultado) => {
        if (!ativo) return
        setDados(resultado)
        setErro(null)
      })
      .catch((e) => {
        if (ativo) setErro(mensagemDe(e, 'Não foi possível carregar.'))
      })
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versao, ...dependencias])

  return {
    dados,
    erro,
    carregando: dados === null && erro === null,
    recarregar: () => setVersao((v) => v + 1),
  }
}
