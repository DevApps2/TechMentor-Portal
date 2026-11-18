import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { listarNotificacoes } from '../api/parceira'
import { useSessao } from '../contexto/sessaoContexto'

/** Evento que as telas disparam quando leem notificações, para o número do menu atualizar na hora. */
export const NOTIFICACOES_MUDARAM = 'notificacoes-mudaram'

const classe = ({ isActive }: { isActive: boolean }) => (isActive ? 'ativo' : '')

/** Moldura das telas logadas: menu no topo e a área da página embaixo. */
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
    <>
      <header className="menu">
        <strong className="marca">TechMentor <span>parceiras</span></strong>
        <nav>
          <NavLink to="/" end className={classe}>Início</NavLink>
          <NavLink to="/cursos" className={classe}>Cursos</NavLink>
          <NavLink to="/metricas" className={classe}>Números</NavLink>
          <NavLink to="/notificacoes" className={classe}>
            Avisos{naoLidas > 0 && <span className="contador">{naoLidas}</span>}
          </NavLink>
        </nav>
        <button className="secundario" onClick={sair}>Sair</button>
      </header>
      <main className="pagina">
        <Outlet />
      </main>
    </>
  )
}
