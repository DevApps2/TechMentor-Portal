/** Blocos cinza animados que aparecem no lugar do conteúdo enquanto ele carrega. */
export default function Esqueleto({ linhas = 3, altura = 76 }: { linhas?: number; altura?: number }) {
  return (
    <div className="esqueletos" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="esqueleto" style={{ height: altura }} />
      ))}
    </div>
  )
}
