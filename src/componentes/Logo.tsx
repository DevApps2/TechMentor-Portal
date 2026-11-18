/** O logo do TechMentor (o mesmo do app): quadrado arredondado em degradê com "</>". */
export default function Logo({ tamanho = 36 }: { tamanho?: number }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 36 36" role="img" aria-label="TechMentor">
      <defs>
        <linearGradient id="logo-degrade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="11" fill="url(#logo-degrade)" />
      <path d="M14 13l-5 5 5 5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 13l5 5-5 5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.6 11.5l-3.2 13" fill="none" stroke="#BDE3FF" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
