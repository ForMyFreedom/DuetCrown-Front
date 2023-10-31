import React, { useState, useMemo, useEffect } from 'react';
import './ModPlayerHandler.css'
import { Capacities, ExtendedSignal, Minucie, Modification, Player, StatConst, Thing, getSignalWithAmount } from '../../UserDomain';
import EditableText from '../EditableText/EditableText';
import { TRANSLATE_BASIC_ATRIBUTE, TRANSLATE_SPECIAL, generalTranslator } from '../Attibutes/Definitions';

interface Props {
  user: Player
  setUser: React.Dispatch<React.SetStateAction<Player>>
  target: Minucie | Thing
  setTarget: (t: Modification[]) => void
}

const ModPlayerHandler: React.FC<Props> = ({ user, setUser, target, setTarget }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [modValue, setModValue] = useState<ExtendedSignal>('+')
  const [capSelected, setCapSelected] = useState('')
  const [kind, setKind] = useState<Modification['kind']>('capacity')
  const [statSelected, setStatSelected] = useState('')

  const mundainCapacities = useMemo(() => {
    return Object.keys(user.capacities.basics) as (keyof Player['capacities']['basics'])[]
  }, [user.capacities.basics])

  const specialCapacities = useMemo(() => {
    const peculiarKeys = Object.keys(user.capacities.peculiars)
    const specialKeys = Object.keys(user.capacities.specials)
    return specialKeys.concat(peculiarKeys)
  }, [user.capacities.peculiars, user.capacities.specials])

  useEffect(() => {
    const updateFinalMods = (finalMods: Modification[], prevUser: Player) => {
      if(finalMods.join()==prevUser.currentMods.join()) return prevUser
      const newUser: Player = { ...prevUser, currentMods: finalMods };
      return newUser
    }

    const getApplicatedFinalMods = (target: Minucie|Thing, prevUser: Player) => {
      if(!target.modifications) return undefined
      if(target.modifications.join()=='') return undefined
      let newMods = [... prevUser.currentMods]
      for(const mod of target.modifications) {
        newMods = newMods.filter(m => m.origin!=mod.origin || m.keywords.join() != mod.keywords.join())
      }
      return target.modifications.concat(newMods)
    }

    const getNotApplicatedFinalMods = (prevUser: Player) => {
      return prevUser.currentMods.filter(m=>m.origin!=target.name)
    }

    setUser(prevUser => {
      if(target.applicated){
        const finalMods = getApplicatedFinalMods(target, prevUser)
        return finalMods ? updateFinalMods(finalMods, prevUser) : prevUser
      } else {
        const finalMods = getNotApplicatedFinalMods(prevUser)
        return updateFinalMods(finalMods, prevUser)
      }
    })
  }, [setUser, target])

  const filterModValue = (v: string) => {
    if (v.match(/^-?\d+[+-]$/)) {
      const amountAsString = v.substring(0, v.length - 1)
      const signalAsString = v[v.length - 1]
      if(Number(amountAsString) && (signalAsString=='+' || signalAsString=='-')){
        const amount = Number(amountAsString)
        const signal = signalAsString as '+' | '-'
        return getSignalWithAmount(amount, signal)
      }
    }
    if(v.match(/^[+]{1,3}$|^(-){1,3}$/)) {
      return v
    }
    return '+'
  }

  const toggleSelectedCap = (cap: string) => {
    if(capSelected == cap) {
      setCapSelected('')
    } else {
      setCapSelected(cap)
    }
  }

  const toggleSelectedStat = (stat: string) => {
    if(statSelected == stat) {
      setStatSelected('')
      setKind('capacity')
    } else {
      setStatSelected(stat)
      setKind('stat')
    }
  }

  const confirmate = () => {
    if(!capSelected||!kind) return
    const newTarget = {...target}
    if(!newTarget.modifications) { newTarget.modifications = [] }
    const keywords = (statSelected) ? [capSelected, statSelected] : [capSelected]
    if(newTarget.modifications.map(m=>m.keywords.join()).includes(keywords.join())) return

    newTarget.modifications.push({
      kind: kind as Modification['kind'], value: modValue,
      origin: target.name, keywords: keywords
    })

    setTarget(newTarget.modifications)
    setModalOpen(false)
  }

  const renderKeywords = (keywords: string[]) => {
    if(keywords.length==1){
      return generalTranslator(keywords[0])
    } else {
      return `${generalTranslator(keywords[0])} [${keywords[1]}]`
    }
  }

  const removeMod = (index: number) => {
    return () => {
      const newTarget = {...target}
      if(!newTarget.modifications) { newTarget.modifications = [] }
      const [removed] = newTarget.modifications.splice(index, 1)
      setTarget(newTarget.modifications)
      setUser(prevUser => {
        if(!target.applicated) return prevUser
        const newMods = prevUser.currentMods.filter(m => m.origin!=removed.origin || m.keywords.join() != removed.keywords.join())
        return {...prevUser, currentMods: newMods}
      })
    }
  }

  return (
    <>
      <div>
        {target.modifications?.map((mod, index) => {
          return (
            <div key={index} className='mod-container'>
              <p onClick={removeMod(index)}>{`${renderKeywords(mod.keywords)} ${mod.value}`}</p>
            </div>
          )
        })}
        <button className='button--mod' onClick={()=>setModalOpen(true)}>Adicionar Modificação</button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p className='no-margin-bottom'>No Modificador, pode-se inserir [N]+ ou [N]-</p>
            <p className='no-margin-h'>Escolha algum Atributo, e se desejar, um STAT</p>
            <div className='mod-value--group'>
              <h2>Modificador:</h2>
              <EditableText
                  text={modValue}
                  dataSetter={setModValue as (value: string) => void}
                  className='mod-value--input'
                  filter={filterModValue}
              />
            </div>
            <ul className='mod-keyword--group'>
              <li>
                <h2>Atributos Mundanos</h2>
                <ul className='grid-of-options'>
                  {mundainCapacities.map((cap, index) => {
                    return (
                      <button className={cap == capSelected ? 'selected' : ''} key={index} onClick={()=>toggleSelectedCap(cap)}>{
                        TRANSLATE_BASIC_ATRIBUTE[cap]
                      }</button>
                    )
                  })}
                </ul>
              </li>
              <li>
                <h2>STAT?</h2>
                <ul className='grid-of-options'>
                  {StatConst.map((stat, index) => {
                    return (
                      <button className={stat == statSelected ? 'selected' : ''} key={index} onClick={()=>toggleSelectedStat(stat)}>{stat}</button>
                    )
                  })}
                </ul>
              </li>
              <li>
                <h2>Atributos Especiais</h2>
                <ul className='grid-of-options'>
                  {specialCapacities.map((cap, index) => {
                    return (
                      <button className={cap == capSelected ? 'selected' : ''} key={index} onClick={()=>toggleSelectedCap(cap)}>{
                        TRANSLATE_SPECIAL[cap as keyof Capacities['specials']] || cap
                      }</button>
                    )
                  })}
                </ul>
              </li>
            </ul>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button onClick={()=>setModalOpen(false)}>Fechar</button>
              <button onClick={confirmate}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModPlayerHandler;