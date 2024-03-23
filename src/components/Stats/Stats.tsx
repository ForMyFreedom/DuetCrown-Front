import React, { useCallback, useMemo, useRef, useState, ReactElement, useEffect } from 'react';
import '../Attibutes/Capacities.css'
import './Stats.css'
import { Capacities, ExtendedSignal, Gliph, Modification, Player, Stat, StatConst, getGliphAfterMod, solveDMG, subtractGliphs, sumSignal } from '../../UserDomain'
import { ResultTextOptions } from '../Attibutes/components/definitions';
import AttributeHandler from '../Attibutes/abstract/AttributeHandler';
import UnitChallenge from '../Attibutes/components/UnitChallenge';
import UnitAtribute from '../Attibutes/components/UnitAtribute';
import { getGliphFromCapacityName } from '../MinucesAndThings/Things/definitions';
import { generalTranslator } from '../Attibutes/Definitions';
import UnitNumber from '../Attibutes/components/UnitNumber';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  user: Player;
  setUser: React.Dispatch<React.SetStateAction<Player>>
};


const Stats: React.FC<Props> = ({ user, setUser }) => {
  const [challenge, setChallenge] = useState<Gliph>('FF')
  const [stats, setStats] = useState(user.stats)
  const [isHideStatusModalOpen, setIsHideStatusModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null);

  const lifePercentage = useMemo(() => {
    const life = stats.find(s => s.relativeCapacity=='body' && s.kind=='VIT')

    if(life && life.actual!=undefined){
      return life.actual
    } else {
      return 100
    }
  }, [stats])


  const statWithMod = useMemo(()=>{
    const allMods = user.currentMods
    const newStats: Stat[] = JSON.parse(JSON.stringify(stats))
    for(const mod of allMods) {
      if (mod.kind == 'stat') {
        const stat = newStats.find((s: Stat) => s.relativeCapacity==mod.keywords[0] && s.kind==mod.keywords[1])
        if(stat){
          stat.naturalMod = sumSignal(stat.naturalMod, mod.value)
        } else {
          newStats.push({relativeCapacity: mod.keywords[0], kind: mod.keywords[1] as Stat['kind'], naturalMod: mod.value})
        }
      } else {
        for (const kind of StatConst) {
          const internalStat = newStats.find((s: Stat) => s.relativeCapacity==mod.keywords[0] && s.kind==kind)
          if (internalStat) {
            internalStat.naturalMod = sumSignal(internalStat.naturalMod, mod.value)
          } else {
            newStats.push({kind: kind, relativeCapacity: mod.keywords[0], naturalMod: mod.value})
          }
        }
      }
    }
    return newStats
  }, [user.currentMods, stats])

  useEffect(() => {
    setUser(prevUser => {return {...prevUser, stats: stats}})
  }, [setUser, stats])

  useEffect(()=>{
    setStats(user.stats)
  }, [user.stats])

  const setLifePercentage = useCallback((v: number) => {
    setStats(prevStat => {
      const newStat = [...prevStat]
      const life = newStat.find(s => s.relativeCapacity=='body' && s.kind=='VIT')
      if(life) {
        life.actual = v
      } else {
        newStat.push({kind: 'VIT', relativeCapacity: 'body', actual: v, naturalMod: ''})
      }
      return newStat
    })
  }, [])

  const sanityPercentage = useMemo(() => {
    const sanity = stats.find(s => s.relativeCapacity=='mind' && s.kind=='VIT')
    if (sanity && sanity.actual!=undefined) {
      return sanity.actual
    } else {
      return 100
    }
  }, [stats])

  const setSanityPercentage = useCallback((v: number) => {
    setStats(prevStat => {
      const newStat = [...prevStat]
      const life = newStat.find(s => s.relativeCapacity=='mind' && s.kind=='VIT')
      if(life) {
        life.actual = v
      } else {
        newStat.push({kind: 'VIT', relativeCapacity: 'body', actual: v, naturalMod: ''})
      }
      return newStat
    })
  }, [])

  const getAllHidenStats = useMemo(() => {
    const peculiarsStats: Stat[] = getAllAtkDefStat(user, 'peculiars')
    const specialStats: Stat[] = [...getAllAtkDefStat(user, 'specials'), ...getAllDmgVitStat(user, 'specials')]
    const basicsStats: Stat[] =[...getAllAtkDefStat(user, 'basics'), ...getAllDmgVitStat(user, 'basics')]
    const allStats: Stat[] = [...specialStats, ...basicsStats, ...peculiarsStats].filter(a => (a.kind == 'VIT' && (a.relativeCapacity == 'body' || a.relativeCapacity == 'mind')) || a.kind!='VIT')
    const filteredStats = filterStat(user, allStats, false)
    return filteredStats.sort((a, b) => generalTranslator(a.relativeCapacity).localeCompare(generalTranslator(b.relativeCapacity)))
  }, [user, user.capacities.peculiars])

  const getDmgVitStat = useMemo(() => {
    const specialStats: Stat[] = getAllDmgVitStat(user, 'specials')
    const basicsStats: Stat[] = getAllDmgVitStat(user, 'basics')
    const allStats: Stat[] = [...specialStats, ...basicsStats].filter(a => (a.kind == 'VIT' && (a.relativeCapacity == 'body' || a.relativeCapacity == 'mind')) || a.kind!='VIT')
    const filteredStats = filterStat(user, allStats)
    for(const stat of statWithMod) {
      const statInPlayer = filteredStats.find(s => s.kind==stat.kind && s.relativeCapacity==stat.relativeCapacity)
      if(statInPlayer){
        statInPlayer.naturalMod = stat.naturalMod
      }
    }
    return filteredStats.sort((a, b) => a.kind.localeCompare(b.kind))
  }, [statWithMod, user, user.capacities.peculiars])

  const getAtkDefStat = useMemo(() => {
    const peculiarsStats: Stat[] = getAllAtkDefStat(user, 'peculiars')
    const specialStats: Stat[] = getAllAtkDefStat(user, 'specials')
    const basicsStats: Stat[] = getAllAtkDefStat(user, 'basics')
    const allStats: Stat[] = [...peculiarsStats, ...specialStats, ...basicsStats]
    const filteredStats = filterStat(user, allStats)

    for(const stat of statWithMod) {
      const statInPlayer = filteredStats.find(s => s.kind==stat.kind && s.relativeCapacity==stat.relativeCapacity)
      if(statInPlayer){
        statInPlayer.naturalMod = stat.naturalMod
      }
    }
    return filteredStats
  }, [statWithMod, user, user.capacities.peculiars])

  const cifraResultDuo = useState('👑👑')
  const extraResultDuo = useState('0')
  const textResultDuo = useState(ResultTextOptions.TotalSucess)

  const [, setCifrasResult] = cifraResultDuo
  const [, setExtraResult] = extraResultDuo
  const [, setTextResult] = textResultDuo

  const rollCountDuo = useState(0)

  const handleSetStat = (oldStat: Stat, gliph: Gliph) => {
    setStats(prevStats => {
      let relativeGliph = getGliphFromCapacityName(user, oldStat.relativeCapacity, false)
      if(!relativeGliph) { return prevStats }

      for(const mod of user.currentMods) {
        if(mod.keywords[0]==oldStat.relativeCapacity) {
          relativeGliph = getGliphAfterMod(relativeGliph, mod.value)
        }
      }

      const newSignal = subtractGliphs(gliph, relativeGliph)
      const newStats = [...prevStats]

      for(const stat of newStats) {
        if(stat.kind==oldStat.kind && stat.relativeCapacity==oldStat.relativeCapacity) {
          stat.naturalMod = newSignal
          return newStats
        }
      }
      // If comes here, means that the state was not found
      newStats.push({kind: oldStat.kind, relativeCapacity: oldStat.relativeCapacity, naturalMod: newSignal})
      return newStats
    })
  }

  const getFinalStatValue = (capacityName: string, mod: ExtendedSignal): Gliph => {
    const capacityGliph = getGliphFromCapacityName(user, capacityName)
    if(capacityGliph) {
      return getGliphAfterMod(capacityGliph, mod)
    }
    return 'FF-'
  }


  const hideStatus = (stat: Stat) => {
    setUser(prevUser => {
      const newToShowStats = {...prevUser.toShowStats}
      newToShowStats[stat.kind] = newToShowStats[stat.kind]?.filter(s => s!=stat.relativeCapacity) ?? []
      return {...prevUser, toShowStats: newToShowStats}
    })
  }

  const unHindeStat = (stat: Stat) => {
    setUser(prevUser => {
      const newToShowStats = {...prevUser.toShowStats}
      newToShowStats[stat.kind] = [...(newToShowStats[stat.kind]??[]), stat.relativeCapacity]
      return {...prevUser, toShowStats: newToShowStats}
    })
  }

  function getStatUnitAtribute(index: number, stat: Stat, isRollable: boolean): ReactElement {
    return <div key={index} className='stat-flex-box'>
      <UnitAtribute
        key={`${stat.relativeCapacity}-${stat.kind}`}
        name={stat.relativeCapacity}
        kind={{name: 'stat', stat: stat.kind}}
        modifications={user.currentMods}
        setMods={(mods: Modification[]) => setUser(prevUser => {return {...prevUser, currentMods: mods}})}
        challenge={challenge} value={getFinalStatValue(stat.relativeCapacity, stat.naturalMod)} setAttributeValue={(v: Gliph) => handleSetStat(stat, v)}
        setCifraResult={setCifrasResult} setTextResult={setTextResult} setExtraResult={setExtraResult} rollCountDuo={rollCountDuo}
        editable={false} rolable={isRollable}
        bottomComponent={
          <button onClick={()=>hideStatus(stat)} className='stat-flex-box-button'>Esconder</button>
        }
      />
    </div>
  }

  function modifyActual(target: 'life' | 'sanity', modType: 'dmg' | 'health') {
    const baseStat = (target=='life'
      ? statWithMod.find((s: Stat) => s.relativeCapacity=='body' && s.kind=='VIT')
      : statWithMod.find((s: Stat) => s.relativeCapacity=='mind' && s.kind=='VIT')
    )

    const setFunction = (target=='life'
      ? setLifePercentage
      : setSanityPercentage
    )

    if (baseStat && baseStat.actual) {
      const baseGliph = getGliphFromCapacityName(user, baseStat.relativeCapacity)
      if(baseGliph){
        const mod = solveDMG(
          getGliphAfterMod(baseGliph, baseStat.naturalMod),
          challenge
        )
        let treatMod = Math.min(Math.max(0, mod), 100)
        treatMod = modType=='dmg' ? -treatMod : treatMod
        setFunction(baseStat.actual + treatMod)
      }
    }
  }

  const getModifyActualButtonGroup = (target: 'life' | 'sanity') => {
    return (
      <div className='flex-row'>
        <button onClick={()=>modifyActual(target, 'dmg')}>
          Aplicar Dano
        </button>
        <button onClick={()=>modifyActual(target, 'health')}>
          Aplicar Cura
        </button>
      </div>
    )
  }

  return (
    <div className='stats-father'>
        <AttributeHandler
          title="STATS"
          user={user}
          setUser={setUser}
          areaOfAtributes={<>
            <div className='challenge'>
              <UnitChallenge
                key='challenge2' value={challenge} setValue={setChallenge}
                customTitle='Desafio/Dano/Cura:'
              />
            </div>
            <div className='multi-render-bigger'>
              <UnitNumber
                title='Vida'
                data={lifePercentage}
                setData={(v: number) => setLifePercentage(v)}
                className='flex-30'
                bottomComponent={
                  getModifyActualButtonGroup('life')
                }
              />
              <UnitNumber
                title='Sanidade'
                data={sanityPercentage}
                setData={(v: number) => setSanityPercentage(v)}
                className='flex-30'
                bottomComponent={
                  getModifyActualButtonGroup('sanity')
                }
              />
            </div>
            <div className='multi-render-bigger'>
              {getAtkDefStat.map((stat, index) => getStatUnitAtribute(index, stat, true))}
            </div>
            <div className='multi-render-bigger'>
              {getDmgVitStat.map((stat, index) => getStatUnitAtribute(index, stat, false))}
            </div>
          </>
          }
          cifraResultDuo={cifraResultDuo}
          extraResultDuo={extraResultDuo}
          textResultDuo={textResultDuo}
          rollCountDuo={rollCountDuo}
          bottomComponent={
            <button onClick={() => setIsHideStatusModalOpen(true)} className='show-hide-button'>STATS Ocultos</button>
          }
        />
        {isHideStatusModalOpen && (
        <div ref={modalRef} className="modal">
          <div className="modal-content stat-modal-content">
            <button onClick={() => setIsHideStatusModalOpen(false)}>Fechar</button>
              <div className='group-of-stats'>
                {getAllHidenStats.map((stat) => {
                  const name = generalTranslator(stat.relativeCapacity)
                  return <li onClick={()=>unHindeStat(stat)}>
                    {`${name} [${stat.kind}]`}
                  </li>
                })}
              </div>
          </div>
        </div>
        )}
    </div>
  );
};

function getAllAtkDefStat(user: Player, key: keyof Capacities): Stat[] {
  return Object.keys(user.capacities[key]).flatMap((p)=>{
    return [
      { kind: 'ATK', naturalMod: '', relativeCapacity: p },
      { kind: 'DEF', naturalMod: '', relativeCapacity: p }
    ]
  })
}

function getAllDmgVitStat(user: Player, key: keyof Capacities): Stat[] {
  return Object.keys(user.capacities[key]).flatMap((p)=>{
    return [
      { kind: 'DMG', naturalMod: '', relativeCapacity: p },
      { kind: 'VIT', naturalMod: '', relativeCapacity: p }
    ]
  })
}

function filterStat(user: Player, statArray: Stat[], trueFilter: boolean = true): Stat[] {
  return statArray
  .filter(s => trueFilter ?
    user.toShowStats[s.kind]?.includes(s.relativeCapacity):
    !user.toShowStats[s.kind]?.includes(s.relativeCapacity)
  )
}


export default Stats;