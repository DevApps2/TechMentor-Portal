import { useNavigate } from 'react-router-dom'
import { dataBr } from '../api/mensagem'
import { listarNotificacoes, marcarLidas } from '../api/parceira'
import type { Notificacao } from '../api/tipos'
import { NOTIFICACOES_MUDARAM } from '../componentes/Layout'
import { useSessao } from '../contexto/sessaoContexto'
import { useDados } from '../hooks/useDados'
import Esqueleto from '../componentes/Esqueleto'
import EstadoVazio from '../componentes/EstadoVazio'

export default function Notificacoes() {
  const { usuario } = useSessao()
  const navegar = useNavigate()
  const usuarioId = usuario?.id ?? 0
  const lista = useDados(() => listarNotificacoes(usuarioId), [usuarioId])

  async function marcar(id?: number) {
    try {
      await marcarLidas(usuarioId, id)
      lista.recarregar()
      window.dispatchEvent(new Event(NOTIFICACOES_MUDARAM))
    } catch {
      // falha ao marcar não impede de abrir o assunto
    }
  }

  /** O toque marca como lida e, quando o aviso tem destino conhecido, leva à tela do assunto. */
  function abrir(n: Notificacao) {
    if (!n.lida) marcar(n.id)
    if (n.destino === 'CURSO_DA_PARCEIRA' && n.referencia) navegar(`/cursos/${n.referencia}`)
    else if (n.destino === 'PERFIL_DA_PARCEIRA') navegar('/')
  }

  const naoLidas = lista.dados?.filter((n) => !n.lida).length ?? 0

  return (
    <>
      <div className="topo">
        <h1>Avisos</h1>
        {naoLidas > 0 && <button className="secundario" onClick={() => marcar()}>Marcar todos como lidos</button>}
      </div>

      {lista.erro && <p className="erro" role="alert">{lista.erro}</p>}
      {lista.carregando && <Esqueleto linhas={2} />}
      {lista.dados?.length === 0 && (
        <EstadoVazio icone="avisos" titulo="Nenhum aviso por aqui" texto="Quando a equipe responder sobre seus cursos ou sua conta, você verá aqui." />
      )}

      <div className="lista">
        {lista.dados?.map((n) => (
          <button key={n.id} className={`cartao largo aviso-item ${n.lida ? '' : 'nao-lida'}`} onClick={() => abrir(n)}>
            <strong>{n.titulo}</strong>
            <span>{n.mensagem}</span>
            <span className="mudo">{dataBr(n.criadaEm)}</span>
          </button>
        ))}
      </div>
    </>
  )
}
