import { Navigate, Outlet } from 'react-router-dom'
import { useSessao } from '../contexto/sessaoContexto.ts'

/** Só deixa passar quem está logada; senão, manda para o login. */
export default function RotaProtegida() {
    const { usuario } = useSessao()
    return usuario ? <Outlet /> : <Navigate to="/entrar" replace />
}