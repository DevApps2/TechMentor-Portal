import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { listarNotificacoes } from '../api/parceira'
import { useSessao } from '../contexto/sessaoContexto'
import Icone, { type NomeDoIcone } from './Icone'
import Logo from './Logo'

/** Evento que as telas disparam quando leem notificações, para o número do menu atualizar na hora. */
export const NOTIFICACOES_MUDARAM = 'notificacoes-mudaram'

const ITENS: { para: string; rotulo: string; icone: NomeDoIcone; fim?: boolean }[] = [
  { para: '/', rotulo: 'Início', icone: 'inicio', fim: true },
  { para: '/cursos', rotulo: 'Cursos', icone: 'cursos' },
  { para: '/metricas', rotulo: 'Números', icone: 'numeros' },
  { para: '/notificacoes', rotulo: 'Avisos', icone: 'avisos' },
]

/** Moldura das telas logadas: menu lateral (no celular vira uma faixa no topo) e a área da página. */
export default function Layout() {
  const { usuario, sair } = useSessao()
  const [naoLidas, setNaoLidas] = useState(0)

  useEffect(() => {
    if (!usuario) return
    let ativo = true

    const atualizar = () =>
      listarNotificacoes(usuario.id)
        .then((lista) => {
          if (ativo) setNaoLidas(lista.filter((n) => !n.lida).length)
        })
        .catch(() => {})

    atualizar()
    const relogio = setInterval(atualizar, 60_000)
    window.addEventListener(NOTIFICACOES_MUDARAM, atualizar)

    return () => {
      ativo = false
      clearInterval(relogio)
      window.removeEventListener(NOTIFICACOES_MUDARAM, atualizar)
    }
  }, [usuario])

  return (
    <div className="app">
      <aside className="lateral">
        <div className="lateral-marca">
          <Logo tamanho={38} />
          <div>
            <strong>TechMentor</strong>
            <span>Parceiras</span>
          </div>
        </div>

        <nav aria-label="Principal">
          {ITENS.map((item) => (
            <NavLink key={item.para} to={item.para} end={item.fim} className={({ isActive }) => (isActive ? 'ativo' : '')}>
              <Icone nome={item.icone} />
              <span>{item.rotulo}</span>
              {item.para === '/notificacoes' && naoLidas > 0 && <span className="contador">{naoLidas}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="lateral-usuario">
          <span className="avatar" aria-hidden="true">{(usuario?.nome ?? '?').trim().charAt(0).toUpperCase()}</span>
          <div className="lateral-nome">
            <strong>{usuario?.nome}</strong>
            <span>{usuario?.email}</span>
          </div>
          <button className="icone-botao" onClick={sair} aria-label="Sair" title="Sair">
            <Icone nome="sair" />
          </button>
        </div>
      </aside>

      <main className="conteudo">
        <div className="pagina">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
