import React, { useState, useEffect, useRef, RefObject } from 'react';
import './Navbar.css'
import { Player } from '../../UserDomain';
import GetRecentCharacterService from '../../services/GetRecentCharacterService';
import { NavigateFunction } from 'react-router-dom';
import UpdateCharacterService from '../../services/UpdateCharacterService';
import { toast } from 'react-toastify';

type Props = {
  userRef: React.MutableRefObject<Player>
  setUser: (user: Player) => void
  jumpRefs: React.MutableRefObject<HTMLElement>[]
  navigate: NavigateFunction
};

export const SAFE_MODE_CODE = 'isSafeMode'
export const PLAYER_CODE = 'player'
export const AUTH_CODE = 'auth'
export const PLAYER_ID_CODE = 'player_id'

const Navbar: React.FC<Props> = ({ userRef, setUser, jumpRefs, navigate }) => {
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false)
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);

  const [isSafeMode, setIsSafeMode] = useState<boolean>(
    localStorage.getItem(SAFE_MODE_CODE) ? Boolean(Number(localStorage.getItem(SAFE_MODE_CODE))) : false
  );

  useEffect(() => {
    const handleBeforeUnloadCallback = () => handleBeforeUnload(isSafeMode, userRef);
    window.addEventListener('beforeunload', handleBeforeUnloadCallback);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadCallback);
    };
  }, [isSafeMode, userRef]);

  const updateUser = () => {
    const id = localStorage.getItem(PLAYER_ID_CODE)
    const auth = localStorage.getItem(AUTH_CODE)
    if(!id||!auth) { return }
    UpdateCharacterService.update(id, auth, userRef.current)
      .then(() => {
        toast.success('Update successful!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .catch(() => {
        toast.error('Update failed!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
  }

  const changeMode = () => {
    setIsSafeMode(!isSafeMode)
  }

  const refreshUser = () => {
    const id = localStorage.getItem(PLAYER_ID_CODE)
    const auth = localStorage.getItem(AUTH_CODE)
    if(!id||!auth) { return }
    GetRecentCharacterService.get(id,auth).then((result) => {
      userRef.current = result.data
      localStorage.setItem(PLAYER_CODE, JSON.stringify(userRef.current))
      window.location.reload()
    })
  }

  const jumpTo = (index: number) => {
    setIsJumpModalOpen(false)
    jumpRefs[index].current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
  }

  const logout = () => {
    localStorage.removeItem(AUTH_CODE)
    localStorage.removeItem(PLAYER_ID_CODE)
    localStorage.removeItem(PLAYER_CODE)
    navigate('/login')
  }

  const downloadBackup = () => {
    const data = JSON.stringify(userRef.current);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${userRef.current.name}-${userRef.current.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const showFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const text = e.target?.result
      if(text){
        try{
          const newPlayer = JSON.parse(text.toString()) as Player
          setUser(newPlayer)
          toast.success('Backup carregado com sucesso!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }catch(e) {
          console.log(e)
          toast.error('Falha ao carregar backup!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      }
    };
    if(e.target.files){
      reader.readAsText(e.target.files[0])
    }
  }

  const handleInsertBackup = () => {
    if(!fileInputRef.current) { return }
    fileInputRef.current.click()
    fileInputRef.current.value = ''
  }

  return (
    <div className="navbar">
      <h1 className="header mid-hover" onClick={()=>setIsJumpModalOpen(!isJumpModalOpen)}>Ficha DuetCrown</h1>
      {isJumpModalOpen &&
      <div className='jump-modal'>
        <button onClick={()=>jumpTo(0)}>Imagem</button>
        <button onClick={()=>jumpTo(1)}>Identidade/Sumário</button>
        <button onClick={()=>jumpTo(2)}>Capacidades Mundanas</button>
        <button onClick={()=>jumpTo(3)}>Capacidades Especiais</button>
        <button onClick={()=>jumpTo(4)}>STATS</button>
        <button onClick={()=>jumpTo(5)}>Movimentos</button>
        <button onClick={()=>jumpTo(6)}>Evoluções/Extensões</button>
        <button onClick={()=>jumpTo(7)}>Minúcias/Coisas</button>
        <button onClick={()=>jumpTo(8)}>Anotações</button>
      </div>
      }
      <div className="navbar-options">
        <div className='button-group--nav'>
          <button onClick={updateUser}>Atualizar</button>
          <button onClick={refreshUser}>Recarregar</button>
        </div>
        <div className='button-group--nav'>
          <a href='#' onClick={downloadBackup}>   <button>Baixar Backup</button> </a>
          <a href='#' onClick={()=>{}}>
            <button onClick={handleInsertBackup}> Enviar Backup </button>
            <input ref={fileInputRef}  style={{display: 'none'}} type="file" onChange={(e) => showFile(e)} />
          </a>
        </div>
        <div className='button-group--nav'>
          <button onClick={changeMode}>{`${isSafeMode? 'Safe' : 'Unsafe'}Mode`}</button>
          <button onClick={logout}>Deslogar</button>
        </div>
      </div>
    </div>
  );
};

function handleBeforeUnload(isSafeMode: boolean, userRef: React.MutableRefObject<Player | undefined>) {
  if (!isSafeMode) {
    localStorage.setItem(PLAYER_CODE, JSON.stringify(userRef.current));
  }
  localStorage.setItem(SAFE_MODE_CODE, String(Number(isSafeMode)))
}

export default Navbar;