/** Texto de erro pronto para mostrar: usa a mensagem da API quando houver. */
export function mensagemDe(erro: unknown, padrao = 'Algo deu errado. Tente de novo.'): string {
  return erro instanceof Error && erro.message ? erro.message : padrao
}

/** Troca de lugar o item `de` pelo `para` e devolve a nova lista (para reordenar). */
export function mover<T>(lista: T[], de: number, para: number): T[] {
  if (para < 0 || para >= lista.length) return lista
  const copia = [...lista]
  const [item] = copia.splice(de, 1)
  copia.splice(para, 0, item)
  return copia
}

export function dataBr(iso: string | null | undefined): string {
  if (!iso) return ''
  const data = new Date(iso)
  return Number.isNaN(data.getTime()) ? '' : data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
