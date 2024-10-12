import  React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import LoginService from '../../services/LoginService';
import { AUTH_CODE, PLAYER_CODE, PLAYER_ID_CODE } from '../Navbar/Navbar';

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    setError('')

    LoginService.login(
      (event.currentTarget.name as unknown as {value: string}).value,
      (event.currentTarget.password as unknown as {value: string}).value
    )
      .then(response => {
        const data = response.data
        localStorage.removeItem(PLAYER_CODE)
        localStorage.setItem(AUTH_CODE, data.token)
        localStorage.setItem(PLAYER_ID_CODE, data.playerId)
        navigate('/')
      })
      .catch(error => {
        setIsLoading(false)
        setError(error.response.data.errors[0].message)
      })
    
  }

  const goToRegister = () => {
    navigate('/register')
  }

  const gotoTest = () => {
    navigate('/test')
  }

  return (
    <div className='login'>
      <h1 className='header-text'>DuetCrown</h1>
      <h1 className='header-login'>Login</h1>
      <form className='login-form' onSubmit={submitLogin}>
        <p>{import.meta.env.BASE_URL}</p>
        <label  className='login-label'  htmlFor='name'>Nome</label>
        <input  className='login-input'  type='text' id='name' />
        <label  className='login-label'  htmlFor='password'>Senha</label>
        <input  className='login-input'  type='password' id='password' />
        <button className='login-button' type='submit'>Entrar</button>
        <button className='login-button margin-top-1' onClick={goToRegister} type='button'>Registrar</button>
        <button className='login-button margin-top-1' onClick={gotoTest}>Testar!</button>
        {isLoading && <div>Carregando...</div>}
        {error && <div className='login-error'>{error}</div>}
      </form>
    </div>
  );
};

export default Login;