import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Login from './components/Login/Login.tsx'
import Register from './components/Register/Register.tsx'

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
    path: '/',
    element: <App />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router}/>
)