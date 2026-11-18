import type { ReactNode } from 'react'
import Icone, { type NomeDoIcone } from './Icone'

/** Aviso amigável para quando uma lista está vazia. */
export default function EstadoVazio({ icone, titulo, texto, children }: {
  icone: NomeDoIcone
  titulo: string
  texto: string
  children?: ReactNode
}) {
  return (
    <div className="vazio">
      <span className="vazio-icone"><Icone nome={icone} tamanho={26} /></span>
      <strong>{titulo}</strong>
      <p>{texto}</p>
      {children}
    </div>
  )
}
