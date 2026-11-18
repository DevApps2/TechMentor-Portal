import type { ReactNode } from 'react'
import Logo from './Logo'

/** Moldura das telas sem login (entrar, convite, esqueci a senha): painel da marca ao lado e o formulário. */
export default function TelaDeEntrada({ children }: { children: ReactNode }) {
  return (
    <div className="entrada">
      <aside className="entrada-marca">
        <div className="marca-topo">
          <Logo tamanho={42} />
          <span>TechMentor</span>
        </div>

        <div className="marca-texto">
          <h2>Publique seus cursos para quem está começando em tecnologia</h2>
          <ul>
            <li>Seu nome como crédito em cada curso</li>
            <li>Revisão da nossa equipe antes de publicar</li>
            <li>Acompanhe quantas alunas começam e concluem</li>
          </ul>
        </div>

        <small>Área das instituições parceiras</small>
      </aside>

      <section className="entrada-form">{children}</section>
    </div>
  )
}
