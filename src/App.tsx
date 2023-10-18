import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Capacities, Player } from './UserDomain'
import IdentityAndSummary from './components/IdentityAndSummary/IdentityAndSummary';
import CapacitiesElement from './components/Attibutes/Capacities';
import EditableText from './components/EditableText/EditableText';
import PlayerImage from './components/PlayerImage/PlayerImage';
import EvolutionsAndExtensions from './components/EvolutionsAndExtensions/EvolutionsAndExtensions';
import MinucesAndThings from './components/MinucesAndThings/MinucesAndThings';
import Anotation from './components/Anotation/Anotation';
import Stats from './components/Stats/Stats';
import Moviments from './components/Moviments/Moviments';
import Navbar, { AUTH_CODE, PLAYER_CODE, PLAYER_ID_CODE } from './components/Navbar/Navbar';
import GetRecentCharacterService from './services/GetRecentCharacterService';
import { ToastContainer } from 'react-toastify';



function App() {
  const [user, setUser] = useState<Player>(BLANK_PLAYER)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const jumpRefs: React.MutableRefObject<HTMLElement>[] = Array.from({ length: 9 }, () => useRef<HTMLElement>()) as React.MutableRefObject<HTMLElement>[]

  const navigate = useNavigate()

  const mundainAtributes: Partial<Capacities> = useMemo(() => {
    return {basics: user.capacities.basics}
  }, [user?.capacities])

  const especialAtributes: Partial<Capacities> = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { basics, ...otherCapacities } = user.capacities;
    return otherCapacities
  }, [user?.capacities])

  useEffect(() => {
    const root = document.documentElement;
    if(user?.primaryColor) {
      root.style.setProperty('--primary-color', user.primaryColor);
    }
  }, [user?.primaryColor]);


  const userRef = useRef(user);

  useEffect(() => {
    const requestLocalUser = (): Player | undefined => {
      const localUser = localStorage.getItem(PLAYER_CODE);
      if (localUser) {
        try{
          setUser(JSON.parse(localUser));
          return JSON.parse(localUser)
        }catch(e){
          return undefined
        }
      }
    }

    const requestUserFromServer = async (): Promise<Player | undefined> => {
      const auth = localStorage.getItem(AUTH_CODE);
      const playerId = localStorage.getItem(PLAYER_ID_CODE);
      if (!auth || !playerId) {
        return undefined
      }
      try {
        const response = await GetRecentCharacterService.get(playerId, auth)
        if(response){
          return response.data as Player
        }
      } catch(e) { return undefined }
    }

    requestUserFromServer()
      .then(userFromServer => {
      const userFromLocal = requestLocalUser()
      if (!userFromServer) {
        localStorage.removeItem(AUTH_CODE)
        localStorage.removeItem(PLAYER_ID_CODE)
        navigate('/login')
        return
      }

      if (userFromLocal) { setUser(userFromLocal)  }
      else               { setUser(userFromServer) }
    })
  }, [navigate]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if(userRef.current?.primaryColor) {
      root.style.setProperty('--primary-color', userRef.current.primaryColor);
    }
  }, [userRef.current?.primaryColor]);

  if (!user || user.name == '') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar userRef={userRef} setUser={setUser} jumpRefs={jumpRefs} navigate={navigate}/>
      <ToastContainer />
      <div className="container">
        <span ref={jumpRefs[0]}>
          <PlayerImage user={user} setUser={setUser}/>
        </span>
        <h1 className="players-name">{user.name}</h1>
        <EditableText
          text={user.nickname}
          extraTextRender={(value: string) => `"${value}"`}
          dataSetter={(value: string) => setUser({ ...user, nickname: value })}
          className="players-nick-name small-hover"
        />

        <span ref={jumpRefs[1]}>
          <IdentityAndSummary user={user} setUser={setUser} />
        </span>
        <span ref={jumpRefs[2]}>
          <CapacitiesElement title='basics' baseAtributeData={mundainAtributes}
            user={user} setUser={setUser} setCapacities={(capa: Capacities) => setUser({...user, capacities: capa})}
          />
        </span>
        <span ref={jumpRefs[3]}>
          <CapacitiesElement title='specials' baseAtributeData={especialAtributes} className='special-container'
            user={user} setUser={setUser} setCapacities={(capa: Capacities) => setUser({...user, capacities: capa})}
            showAddNewAtributeButton={true}
          />
        </span>
        <span ref={jumpRefs[4]}>
          <Stats user={user} setUser={setUser} />
        </span>
        <span ref={jumpRefs[5]}>
          <Moviments user={user} setUser={setUser}/>
        </span>
        <span ref={jumpRefs[6]}>
          <EvolutionsAndExtensions user={user} setUser={setUser} />
        </span>
        <span ref={jumpRefs[7]}>
          <MinucesAndThings user={user} setUser={setUser} />
        </span>
        <span ref={jumpRefs[8]}>
          <Anotation user={user} setUser={setUser} />
        </span>
      </div>
    </div>
  );
}

export default App;


const BLANK_PLAYER: Player = {
  "primaryColor": "##ffffff",
  "id": 0,
  "image": {
    "url": "",
    "xDesloc": 0,
    "yDesloc": 0,
    "scale": 1
  },
  "name": "",
  "nickname": "",
  "identity": { },
  "sumary": { },
  "capacities": {
    "basics": {
      "strength": "F",
      "agility": "F",
      "body": "F",
      "mind": "F",
      "senses": "F",
      "charisma": "F",
    },
    "peculiars": { },
    "specials": {
      "ambition": "F",
      "judge": "F",
      "wish": "F",
      "will": "F"
    },
    "primal": {
      "kind": "Hope",
      "value": 0
    }
  },
  "stats": [],
  "toShowStats": {},
  "moviments": [],
  "things": [],
  "minucies": [],
  "evolutions": {
    "physical": 0,
    "espiritual": 0
  },
  "extensions": [],
  "anotations": "",
}