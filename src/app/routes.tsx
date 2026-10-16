import { Navigate, Route, Routes } from 'react-router'
import { HomePage } from '../pages/HomePage'
import { ResultPage } from '../pages/ResultPage'
import { RootLayout } from './RootLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="result/:jobId" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
