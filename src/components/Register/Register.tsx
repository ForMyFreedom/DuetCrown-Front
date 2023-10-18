import  React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Login/Login.css'
import { AUTH_CODE, PLAYER_ID_CODE } from '../Navbar/Navbar';
import RegisterService, { RegisterForm } from '../../services/RegisterService';

type EventMapper<T> = {[x in keyof T]: {value: string}}

const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    setError('')

    const castEvent = event as unknown as React.FormEvent<EventMapper<RegisterForm>>;

    const password = castEvent.currentTarget.password.value
    const repeatPassword = castEvent.currentTarget.repeatPassword.value

    if(password !== repeatPassword) {
      setIsLoading(false)
      setError('Senhas não conferem')
      return
    }


    const form: RegisterForm = {
      name: castEvent.currentTarget.name.value,
      nickname: castEvent.currentTarget.nickname.value,
      primaryColor: castEvent.currentTarget.primaryColor.value,
      password: castEvent.currentTarget.password.value,
      repeatPassword: castEvent.currentTarget.repeatPassword.value,
      image: castEvent.currentTarget.image.value,
      registerToken: castEvent.currentTarget.registerToken.value
    }
    
    RegisterService.register(form)
      .then(response => {
        const data = response.data
        localStorage.setItem(AUTH_CODE, data.token)
        localStorage.setItem(PLAYER_ID_CODE, data.playerId)
        navigate('/')
      })
      .catch(error => {
        setIsLoading(false)
        setError(error.response.data.errors.map((e: { message: string }) => e.message).join('\n'))
      })
    
  }

  const goToLogin = () => {
    navigate('/login')
  }

  return (
    <div className='register'>
      <h1 className='header-text'>DuetCrown</h1>
      <h1 className='header-login'>Registro</h1>
      <form className='login-form' onSubmit={submitRegister}>
        <label className='login-label'  htmlFor='registerToken'>Token de Registro</label>
        <input className='register-token'  type='text' id='registerToken' />
        <label className='login-label'  htmlFor='name'>Nome do Personagem</label>
        <input className='login-input'  type='text' id='name' />
        <label className='login-label'  htmlFor='nickname'>Título</label>
        <input className='login-input'  type='text' id='nickname' />
        <label className='login-label'  htmlFor='primaryColor'>Cor de Estilo</label>
        <input className='login-color'  type='color' id='primaryColor' />
        <label className='login-label'  htmlFor='password'>Senha</label>
        <input className='login-input'  type='password' id='password' />
        <label className='login-label'  htmlFor='repeatPassword'>Repetir Senha</label>
        <input className='login-input'  type='password' id='repeatPassword' />
        <label className='login-label'  htmlFor='image'>Link da Imagem:</label>
        <input className='login-input'  type='url' id='image' onChange={(e)=>setImageUrl(e.target.value)} />
        <div className="image">
          <img src={imageUrl} />
        </div>
        <p className='image-comment--register'>
          Você poderá ajustar a escala e o deslocamento da imagem posteriormente
        </p>

        <button className='login-button' type='submit'>Registrar-se</button>
      </form>
      {isLoading && <div>Carregando...</div>}
      {error && <div className='login-error'>{error}</div>}
      <button className='login-button margin-top-1' onClick={goToLogin} type='button'>Voltar ao Login</button>
    </div>
  );
};

export default Register;