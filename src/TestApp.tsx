import { useEffect, useState } from 'react';
import App from './App';
import { PLAYER_CODE } from './components/Navbar/Navbar';
import GetBlankCharacterService from './services/GetBlankCharacter';

function TestApp() {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>{
    const local = localStorage.getItem(PLAYER_CODE)
    if(!local) {
      const res = GetBlankCharacterService.get()
      res.then((response) => {
        localStorage.setItem(PLAYER_CODE, JSON.stringify(response.data))
        setLoaded(true)
      })
    } else {
      setLoaded(true)
    }
  }, [])

  if(!loaded) {return <div>Carregando...</div>}

  return (
    <App hasRemoteAcess={false}/>
  );
}

export default TestApp