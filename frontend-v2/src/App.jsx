import Header from './components/Header/Header'
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CanvasPage from './pages/CanvasPage';
import ProtectedRoute from '../ProtectedRoute';
function App() {
  
  return (
    <>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<SignInPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
       />

      <Route
        path="/game-lstm"
        element={
          <ProtectedRoute>
            <CanvasPage route={"predict"} />
          </ProtectedRoute>
        }
       />
      <Route
        path="/game-cnn"
        element={
          <ProtectedRoute>
            <CanvasPage route={"predict_cnn"} />
          </ProtectedRoute>
        }
       />

            </Routes>
          </BrowserRouter>
      
    </>
  )
}

export default App
