import { Navigate, Route, Routes } from 'react-router-dom'
import RotaProtegida from './componentes/RotaProtegida'
import Login from './paginas/Login'
import Painel from './paginas/Painel'
import AceitarConvite from './paginas/AceitarConvite'

export default function App() {
  return (
      <Routes>
        <Route path="/entrar" element={<Login />} />
          <Route path="/convite" element={<AceitarConvite />} />
        <Route element={<RotaProtegida />}>
          <Route path="/" element={<Painel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}