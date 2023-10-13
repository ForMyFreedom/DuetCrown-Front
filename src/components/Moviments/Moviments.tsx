import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Player, Moviment, getGliphAfterMod, modifySignal, Gliph, getMeanOfGliphs } from '../../UserDomain';
import './Moviments.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { getGliphFromCapacityName } from '../MinucesAndThings/Things/definitions';
import EditableText from '../EditableText/EditableText';
import { generalTranslator } from '../Attibutes/Definitions';
import AttributeHandler from '../Attibutes/abstract/AttributeHandler';
import { ResultTextOptions } from '../Attibutes/components/definitions';
import UnitChallenge from '../Attibutes/components/UnitChallenge';
import UnitButtonRoll from '../Attibutes/components/UnitButtonRoll';

interface Props {
  user: Player;
  setUser: React.Dispatch<React.SetStateAction<Player>>
}

const Moviments: React.FC<Props> = ({ user, setUser }) => {
  const [moviments, setMoviments] = useState(user.moviments)
  const [visibleMovements, setVisibleMovements] = useState<{ [key: string]: boolean }>({});

  const [challenge, setChallenge] = useState<Gliph>('FF')
  const rollCountDuo = useState(0)

  const cifraResultDuo = useState('👑👑')
  const extraResultDuo = useState('0')
  const textResultDuo = useState(ResultTextOptions.TotalSucess)

  const [,setCifraResult] = cifraResultDuo
  const [,setExtraResult] = extraResultDuo
  const [,setTextResult]  = textResultDuo


  const movimentsPerCapacities: {[key: string]: Moviment[]} = useMemo(()=>{
    const list: {[key: string]: Moviment[]} = { combined: []
    };
    
    for(const capName of Object.keys(user.capacities.peculiars)){
      list[capName] = [];
    }

    for(const mov of user.moviments){
      if (mov.kind == 'Combined'){
        list['combined'].push(mov)
      } else {
        list[mov.relativeCapacity].push(mov);
      }
    }

    return list;
  }, [user.capacities, user.moviments])


  useEffect(()=>{
    setUser(prevUser => {
      prevUser.moviments = moviments;
      return {...prevUser}
    })
  },[moviments, setUser])


  const toggleMovementVisibility = (capName: string) => {
    setVisibleMovements(prev=>{
      const newVisibleMovements = {...prev};
      newVisibleMovements[capName] = !newVisibleMovements[capName];
      return newVisibleMovements;
    })
  }

  function getMovimentGlyph(mov: Moviment): Gliph {
    if (mov.kind=='Combined') {
      const allCapacities = mov.relativeCapacity.split('|')
      const gliphArray: Gliph[] = allCapacities
        .map(capName=>getGliphFromCapacityName(user, capName))
        .filter(gliph => gliph !== undefined) as Gliph[]
      
      const combinatedGliph = getMeanOfGliphs(gliphArray)
      return combinatedGliph
    } else {
      const gliph = getGliphFromCapacityName(user, mov.relativeCapacity);
      if(gliph != undefined){
        return getGliphAfterMod(gliph, mov.agregated)
      }
      return 'FF-'
    }
  }

  function handleChangeDescription(value: string, mov: Moviment): void {
    setMoviments(prevMoviments=>{
      const newMoviments = [...prevMoviments]
      const findMov = newMoviments.find(m=>m.name === mov.name);
      if(findMov) {
        findMov.description = value;
      }

      return newMoviments
    })
  }

  function handleChangeName(value: string, mov: Moviment): void {
    setMoviments(prevMoviments=>{
      const newMoviments = [...prevMoviments]
      const findMov = newMoviments.find(m=>m.name === mov.name);
      if(!findMov) { return prevMoviments }
      if(value== mov.name) { return prevMoviments }

      if(newMoviments.find(m=>m.name === value)) {
        findMov.name = 'NÃO REPITA NOMES! ' + Math.floor(Math.random()*100000000)
        return newMoviments
      } else{
        findMov.name = value;
      }

      return newMoviments
    })
  }

  useEffect(() => {
    setMoviments(prevMoviments => {
      const newMoviments = prevMoviments.filter(m => m.name !== '');
      if(prevMoviments.length != newMoviments.length){
        return newMoviments;
      }
      return prevMoviments
    });
  }, [setMoviments, moviments]);


  function addNewMoviment(capacityName: string): void {
    setMoviments(prevMoviments => {
      const newMoviments = [...prevMoviments];
      newMoviments.push({
        kind: (capacityName!='combined') ? 'Peculiar' : 'Combined',
        relativeCapacity: (capacityName!='combined') ? capacityName : '',
        agregated: '',
        name: `Movimento Id ${newMoviments.length+1}`,
        description: 'Insira a descrição'
      })
      return newMoviments
    })
  }

  const increaseMod = useCallback((mov: Moviment) => {
    setMoviments((prevMoviments) => {
      const newMoviments = [...prevMoviments];
      const findMov = newMoviments.find((m) => m.name === mov.name);
      if (findMov) {
        findMov.agregated = modifySignal(findMov.agregated, 1);
      }
  
      return newMoviments;
    });
  }, []);

  const descreaseMod = useCallback((mov: Moviment) => {
    setMoviments(prevMoviments=>{
      const newMoviments = [...prevMoviments]
      const findMov = newMoviments.find(m=>m.name === mov.name);
      if(findMov) {
        findMov.agregated = modifySignal(findMov.agregated, -1)
      }

      return newMoviments
  })}, [])
  
  function setCombinedCapacitie(mov: Moviment, index: number, value: string): void {
    setMoviments(prevMoviments => {
      const newMoviments = [...prevMoviments];
      const findMov = newMoviments.find(m => m.name === mov.name);
      if (!findMov || mov.kind != 'Combined') { return prevMoviments }
      const combinatedCapacities = findMov.relativeCapacity.split('|')
      if (value=='') {
        combinatedCapacities.splice(index, 1)
        findMov.relativeCapacity = combinatedCapacities.join('|')
        return newMoviments
      } else {
        combinatedCapacities[index] = value
        findMov.relativeCapacity = combinatedCapacities.join('|')
        return newMoviments
      }
    })
  }

  function addMoreCombinatedCapacities(mov: Moviment): void {
    setMoviments(prevMoviments => {
      const newMoviments = [...prevMoviments];
      const findMov = newMoviments.find(m => m.name === mov.name);
      if (!findMov || mov.kind != 'Combined') { return prevMoviments }
      findMov.relativeCapacity += '|Nova'
      return newMoviments
    })
  }

  return (
      <AttributeHandler
        title="Movimentos"
        user={user}
        setUser={setUser}
        cifraResultDuo={cifraResultDuo}
        extraResultDuo={extraResultDuo}
        textResultDuo={textResultDuo}
        rollCountDuo={rollCountDuo}
        areaOfAtributes={
          <div className='asdd2'>
            <div className='challenge margin-bottom'>
              <UnitChallenge
                key='challenge2' value={challenge} setValue={setChallenge}
                customTitle='Desafio/Dano:'
              />
            </div>
            {Object.entries(movimentsPerCapacities).map(([capName, moviments]) => (
            <div key={capName}  className='group-of-moviments'>
              <button className="list-mov-button capacity-collapsible" onClick={() => toggleMovementVisibility(capName)}>
                <p>
                  {`${generalTranslator(capName)}
                    ${capName!='combined'
                      ? `[${getGliphFromCapacityName(user, capName)}]`
                      : ''
                    }`
                  }
                </p>
                <FontAwesomeIcon
                  icon={visibleMovements[capName] ? faCaretUp: faCaretDown}
                />
              </button>
              {visibleMovements[capName] && (
              <ul className="movement-list">
                {moviments.map(mov=>{
                  return <li key={mov.name}>
                    <div className='name-container--mov'>
                      <UnitButtonRoll
                        value={getMovimentGlyph(mov)}
                        challenge={challenge}
                        setCifraResult={setCifraResult}
                        setTextResult={setTextResult}
                        setExtraResult={setExtraResult}
                        rollCountDuo={rollCountDuo}
                        className='roll-mov-button--mov'
                      />
                      <EditableText
                            text={`${mov.name}`}
                            extraTextRender={(v: string) => `${v} ${mov.agregated} [${getMovimentGlyph(mov)}]`}
                            dataSetter={(v:string)=>handleChangeName(v, mov)}
                            className="movement-name"
                      />
                      <div className='aggregated-gliph-buttons--mov'>
                        <button onClick={()=>descreaseMod(mov)}>-</button>
                        <button onClick={()=>increaseMod(mov)}>+</button>
                      </div>
                    </div>
                    {mov.kind=='Combined' &&
                      <div className='combinated-capacities--mov'>
                        {mov.relativeCapacity.split('|').map((capName, index)=>
                          <EditableText
                            key={`combinated-${capName}-${index}}`}
                            text={capName}
                            dataSetter={(v: string)=>setCombinedCapacitie(mov, index, v)}
                            className="combinated-capacities--mov-p"
                          />
                        )}
                        <button onClick={()=>addMoreCombinatedCapacities(mov)}>More</button>
                      </div>
                    }
                    <div className='editable-text-container--mov'>
                      <EditableText
                          text={mov.description}
                          dataSetter={(v:string)=>handleChangeDescription(v, mov)}
                          className="movement-description"
                          ignoreEnter={true}
                      />
                    </div>
                  </li>
                })}
                <button onClick={()=>addNewMoviment(capName)} className='new-moviment-btn'>Novo Movimento</button>
              </ul>
              )}
            </div>
            ))}
          </div>
        }
      />
  );
};

export default Moviments;