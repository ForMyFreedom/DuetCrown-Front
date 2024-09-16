import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Login from './components/Login/Login.tsx'
import Register from './components/Register/Register.tsx'
import TestApp from './TestApp.tsx'
import { StrictMode } from 'react'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/test',
    element: <TestApp />
  },
  {
    path: '/',
    element: <App hasRemoteAcess={true} />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)