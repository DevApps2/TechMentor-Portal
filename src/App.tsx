import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './componentes/Layout'
import RotaProtegida from './componentes/RotaProtegida'
import AceitarConvite from './paginas/AceitarConvite'
import CursoEditar from './paginas/CursoEditar'
import Cursos from './paginas/Cursos'
import EsqueciSenha from './paginas/EsqueciSenha'
import Login from './paginas/Login'
import Metricas from './paginas/Metricas'
import Notificacoes from './paginas/Notificacoes'
import Painel from './paginas/Painel'

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Login />} />
      <Route path="/convite" element={<AceitarConvite />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Painel />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoEditar />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
