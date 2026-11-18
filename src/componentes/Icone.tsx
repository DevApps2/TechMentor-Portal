const CAMINHOS = {
  inicio: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10',
  cursos: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20',
  numeros: 'M5 20V11M12 20V4M19 20v-6',
  avisos: 'M18 8a6 6 0 1 0-12 0c0 7-3 8.5-3 8.5h18S18 15 18 8ZM10.3 20a2 2 0 0 0 3.4 0',
  sair: 'M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9M16 16l4-4-4-4M20 12H9',
  mais: 'M12 5v14M5 12h14',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  relogio: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  alerta: 'M12 9v4M12 17h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
  livro: 'M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2ZM12 6.5v13',
} as const

export type NomeDoIcone = keyof typeof CAMINHOS

/** Ícones de traço simples (decorativos: o texto ao lado já diz o que é). */
export default function Icone({ nome, tamanho = 20 }: { nome: NomeDoIcone; tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={CAMINHOS[nome]} />
    </svg>
  )
}
