import React, { useState, useRef, useEffect, ReactElement } from 'react';
import './AttributeHandler.css'
import { Capacities, Player } from '../../../UserDomain'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  user: Player;
  setUser: React.Dispatch<React.SetStateAction<Player>>
  addNewAttribute?: (()=>void)
  areaOfAtributes: ReactElement
  cifraResultDuo: [string, React.Dispatch<React.SetStateAction<string>>]
  extraResultDuo: [string, React.Dispatch<React.SetStateAction<string>>]
  textResultDuo: [string, React.Dispatch<React.SetStateAction<string>>]
  rollCountDuo: [number, React.Dispatch<React.SetStateAction<number>>]
  bottomComponent?: ReactElement
};

const AttributeHandler: React.FC<Props> = ({ title, user, setUser, addNewAttribute, areaOfAtributes, cifraResultDuo, textResultDuo, rollCountDuo, extraResultDuo, bottomComponent, ...props }) => {
  const [rollCount] = rollCountDuo
  const [cifrasResult] = cifraResultDuo
  const [extraResult] = extraResultDuo
  const [textResult] = textResultDuo
  
  const [blink, setBlink] = useState(false);
  const [hadAngariated, setHadAngariated] = useState(false)

  const attributeRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setTimeout(() => {
      if(resultRef.current?.classList.contains('blink')){
        setBlink(false);
      }
    }, 500);
  
    if (resultRef?.current && rollCount!=0) {
      setBlink(true)
      attributeRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }
    setHadAngariated(false)
  }, [rollCount]);
  

  const angariate = (primal: Capacities['primal']['kind']) => {
    const oldPrimal = user.capacities.primal
    const newPrimal = Object.assign({}, oldPrimal)
    const randomRoll = Math.floor(Math.random() * 10) + 1

    if(oldPrimal.kind == primal) {
      newPrimal.value += randomRoll
    } else {
      newPrimal.value -= randomRoll
      if(newPrimal.value<=0){
        newPrimal.value *= -1
        newPrimal.kind = newPrimal.kind=='Hope'?'Despair':'Hope'
      }
    }

    setUser({...user, capacities: {...user.capacities, primal: newPrimal}})
    setHadAngariated(true)
  }

  return (
    <div ref={attributeRef} className="full-box">
      <div className="list-atr">
        <h2 key='list-heading' className="list-heading">{title}</h2>
          <div className={`cifras ${blink ? 'blink' : ''}`} ref={resultRef}>
            <h1 className='cifras-result'>{cifrasResult}</h1>
            <h2 className='text-result'>{textResult}</h2>
            {extraResult != '0' &&
              <>
                <h2 className='text-result'> {
                  Number(extraResult)>0 ? '👑'.repeat(Number(extraResult)) : '⚜️'.repeat(-Number(extraResult))
                }
                </h2>
                {!hadAngariated &&
                  <button onClick={() => angariate(Number(extraResult) > 0 ? 'Hope' : 'Despair')}>
                    {`Angariar ${Number(extraResult)>0 ? 'Esperança' : 'Desespero'}`}
                  </button>
                }
              </>
            }
          </div>
        <div key='challenge' className={`${props.className} grid-container`}>
          {areaOfAtributes}
        </div>
        {addNewAttribute &&
          <button onClick={addNewAttribute}>
            Add New Attribute
          </button>
        }
        {bottomComponent}
      </div>
    </div>
  );
};

export default AttributeHandler;