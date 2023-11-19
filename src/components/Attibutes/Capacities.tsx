import React, { useState, useEffect, useMemo } from 'react';
import './Capacities.css'
import { Capacities, Gliph, Player, Stat, getGliphAfterMod, inverseSignal } from '../../UserDomain'
import UnitAtribute from './components/UnitAtribute';
import UnitChallenge from './components/UnitChallenge';
import { TRANSLATE_BASIC_ATRIBUTE, TRANSLATE_KIND_ATRIBUTE, TRANSLATE_SPECIAL } from './Definitions';
import UnitPrimal, { PrimalKind } from './components/UnitPrimal';
import AttributeHandler from './abstract/AttributeHandler';
import { ResultTextOptions } from './components/definitions';
import { isEqualObject } from '../../utils';


type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: keyof typeof TRANSLATE_KIND_ATRIBUTE
  baseAtributeData: Partial<Capacities>
  user: Player;
  setUser: React.Dispatch<React.SetStateAction<Player>>
  setCapacities: (capacitie: Capacities) => void
  showAddNewAtributeButton?: boolean
};

const CapacitiesElement: React.FC<Props> = ({ title, user, setUser, setCapacities, baseAtributeData, showAddNewAtributeButton = false, ...props }) => {
  const [challenge, setChallenge] = useState<Gliph>('FF')
  const [atributes, setAtributes] = useState(baseAtributeData)

  const cifraResultDuo = useState('👑👑')
  const extraResultDuo = useState('0')
  const textResultDuo = useState(ResultTextOptions.TotalSucess)

  const [, setCifrasResult] = cifraResultDuo
  const [, setExtraResult] = extraResultDuo
  const [, setTextResult] = textResultDuo

  const rollCountDuo = useState(0)

  function simplyFind<T>(obj: {[key:string]: T}, search: string): T|undefined {
    const find = Object.entries(obj).find(([k]) => k == search)
    if(find){
      return find[1]
    }else{
      return undefined
    }
  }

  const moddedCapacities = useMemo(() => {
    const newCapacities: Capacities = JSON.parse(JSON.stringify(user.capacities))
    for(const mod of user.currentMods){
      if(mod.kind == 'capacity') {
        const basicFind = simplyFind<Gliph>(newCapacities.basics, mod.keywords[0])
        if(basicFind){
          newCapacities.basics[mod.keywords[0] as keyof Capacities['basics']] = getGliphAfterMod(basicFind, mod.value)
        }
        const specialFind = simplyFind<Gliph>(newCapacities.specials, mod.keywords[0])
        if(specialFind){
          newCapacities.specials[mod.keywords[0] as keyof Capacities['specials']] = getGliphAfterMod(specialFind, mod.value)
        }
        const peculiarFind = simplyFind<Gliph>(newCapacities.peculiars, mod.keywords[0])
        if(peculiarFind){
          newCapacities.peculiars[mod.keywords[0]] = getGliphAfterMod(peculiarFind, mod.value)
        } 
      }
    }
    return newCapacities
  }, [user.capacities, user.currentMods])

  const [peculiarCapacities, setPeculiarCapacities] = useState<Capacities['peculiars']>(moddedCapacities.peculiars)

  useEffect(()=>{
    setPeculiarCapacities(prevCap => {
      return isEqualObject(prevCap, user.capacities.peculiars) ? prevCap : user.capacities.peculiars
    })
  }, [user.capacities.peculiars])

  useEffect(() => {
    setUser(prevUser => {
      const newCapacities = { ...prevUser.capacities, peculiars: peculiarCapacities };
      return { ...prevUser, capacities: newCapacities };
    });
    if (showAddNewAtributeButton) {
      setAtributes(prevAtr => {
        const newPeculiars = { ...prevAtr.peculiars, ...peculiarCapacities };
        return { ...prevAtr, peculiars: newPeculiars };
      });
    }
  }, [peculiarCapacities, setUser, showAddNewAtributeButton]);
  
  useEffect(() => {
    setPeculiarCapacities(prevCap => {
      const notBlankCapNames = Object.keys(prevCap).filter(m => m !== '')
      const newCaps: Capacities['peculiars'] = {}
      for(const name of notBlankCapNames) {
        newCaps[name] = prevCap[name]
      }
      if(Object.keys(prevCap).length != Object.keys(newCaps).length){
        return newCaps;
      }
      return prevCap
    });
  }, [setPeculiarCapacities, peculiarCapacities]);
  

  const addNewAttribute = () => {
    setPeculiarCapacities(prevCapacities => {
      const newCapacities = {
        ...prevCapacities,
        [`Capacidade ${Object.keys(prevCapacities).length+1}`]: 'FF'
      };
      return newCapacities as Capacities['peculiars'];
    });
  };

  function renameAttribute(oldKey: keyof Capacities['peculiars'], newKey: keyof Capacities['peculiars']) {
    const oldValue = user.capacities['peculiars'][oldKey]
    const filteredKeys: (keyof Capacities['peculiars'])[] = Object.keys(user.capacities['peculiars']).filter(x => x!=oldKey) as (keyof Capacities['peculiars'])[]
    const newObj: Capacities['peculiars'] = {}
    for(const k of filteredKeys) {
      newObj[k] = user.capacities['peculiars'][k]
    }

    newObj[newKey] = oldValue
  
    setPeculiarCapacities(newObj as unknown as Capacities['peculiars'])

    setUser(prevUser => {
      for(const thing of prevUser.things) {
        if(thing.relativeCapacity == oldKey){
          thing.relativeCapacity = newKey as string
        }
        if(thing.modifications){
          for(const mod of thing.modifications){
            if(mod.keywords[0] == oldKey){
              mod.keywords = mod.keywords.splice(0, 1, newKey as string)
            }
          }
        }
      }
      for(const minuce of prevUser.minucies) {
        if(minuce.modifications){
          for(const mod of minuce.modifications){
            if(mod.keywords[0] == oldKey){
              mod.keywords = mod.keywords.splice(0, 1, newKey as string)
            }
          }
        }
      }
      for(const stat of prevUser.stats) {
        if(stat.relativeCapacity == oldKey) {
          stat.relativeCapacity = newKey as string
        }
      }
      for(const mov of prevUser.moviments) {
        if(mov.relativeCapacity == oldKey) {
          mov.relativeCapacity = newKey as string
        }
      }
      for(const mods of prevUser.currentMods) {
        if(mods.keywords[0] == oldKey){
          mods.keywords = mods.keywords.splice(0, 1, newKey as string)
        }
      }
      for(const stat of Object.keys(prevUser.toShowStats)) {
        const list = prevUser.toShowStats[stat as Stat['kind']]
        if(list && list.includes(oldKey as string)) {
          prevUser.toShowStats[stat as Stat['kind']] = [...list, newKey as string]?.filter(v=>v!=oldKey)
        }
      }
      return prevUser
    })
  }

  function MultiRender<T extends keyof Capacities>(key: T, TRANSLATER: (x: keyof Capacities[T]) => string, editable: boolean): JSX.Element[] {
    const setMultiValue = (name: string) => {
      return (value: Gliph) => {
        const newCaps: Capacities = {...user.capacities}

        for(const mod of user.currentMods) {
          if(mod.kind=='capacity' && mod.keywords[0]==name) {
            value = getGliphAfterMod(value, inverseSignal(mod.value))
          }
        }

        newCaps[key] = {...newCaps[key], [name]: value}
        setCapacities(newCaps)
      }
    }

    const values = moddedCapacities[key] as {[key: string]: Gliph}
    if(Object.keys(values).length == 0) { return [] }
    return (Object.keys(values) as (keyof Capacities[T])[]).map((internalKey, index) => {
      return <UnitAtribute key={index} name={TRANSLATER(internalKey)}
        challenge={challenge} value={moddedCapacities[key][internalKey] as Gliph} setAttributeValue={setMultiValue(internalKey as string)}
        setCifraResult={setCifrasResult} setTextResult={setTextResult} setExtraResult={setExtraResult} rollCountDuo={rollCountDuo}
        editable={editable} setAttributeName={(newKey: string)=>{renameAttribute(internalKey as string, newKey)}}
      />
    })
  }

  function PrimalRender(index: number): JSX.Element {
    return <UnitPrimal key={index}
      data={user.capacities.primal}
      setAttributeValue={(v: number) => setCapacities({...user.capacities, primal: {...user.capacities.primal, value: v}})}
      setKind={(v: PrimalKind) => setCapacities({...user.capacities, primal: {...user.capacities.primal, kind: v}})}
    />
  }

  
  const AttributeUnitRender: {[T in keyof Capacities]: (index: number) => JSX.Element|JSX.Element[]} = {
    basics: (index: number) => <div key={index} className='multi-render'>{MultiRender<'basics'>('basics', (x=>TRANSLATE_BASIC_ATRIBUTE[x]), false)}</div>,
    specials: (index: number) => <div key={index} className='multi-render'>{MultiRender<'specials'>('specials', (x=>TRANSLATE_SPECIAL[x]), false)}</div>,
    peculiars: (index: number) => <div key={index} className='multi-render'>{MultiRender<'peculiars'>('peculiars', (x => String(x)), true)}</div>,
    primal:(index: number) => PrimalRender(index),
  }

  return (
    <AttributeHandler
      title={`Capacidades ${TRANSLATE_KIND_ATRIBUTE[title]}`}
      user={user}
      setUser={setUser}
      addNewAttribute={showAddNewAtributeButton ? addNewAttribute : undefined}
      areaOfAtributes={<>
        <div className='challenge'>
          <UnitChallenge key='challenge2' value={challenge} setValue={setChallenge}/>
        </div>
        {Object.keys(atributes).map((attributeKey, index) => {
          return AttributeUnitRender[attributeKey as keyof Capacities](index)
        })}
      </>
      }
      cifraResultDuo={cifraResultDuo}
      extraResultDuo={extraResultDuo}
      textResultDuo={textResultDuo}
      rollCountDuo={rollCountDuo}
      {...props}
    />
  );
};

export default CapacitiesElement;