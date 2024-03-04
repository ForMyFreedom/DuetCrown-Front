import React, { useEffect, useState } from 'react';
import '../MinucesAndThings.css'
import { Gliph, GliphConst, Modification, Player, Thing, isGliphInConformity, isGliphInRegularity } from '../../../UserDomain'
import EditableText from '../../EditableText/EditableText';
import { getGliphFromCapacityName } from './definitions';
import { changeOrderInArray, isEqualArray, someMinuceOrThingHasThisName } from '../../../utils';
import ModPlayerHandler from '../../ModPlayerHandler/ModPlayerHandler';
import ImageOfItem, { Item } from '../../ImageOfItem/ImageOfItem';

type Props = {
    user: Player;
    setUser: React.Dispatch<React.SetStateAction<Player>>
};

const Things: React.FC<Props> = ({ user, setUser }) => {
  const [things, setThings] = useState(user.things)

  useEffect(()=>{
    setThings(prevThings => {
      return isEqualArray(prevThings, user.things) ? prevThings : user.things
    })
  }, [user.things])

  useEffect(() => {
    setUser(prevUser => {
      const newUser = { ...prevUser, things };
      return newUser;
    });
  }, [things, setUser]);

  const addNewThing = () => {
    setThings(prevThings => {
      const newThings: Thing [] = [...prevThings, {
        name: 'Item '+prevThings.length, description: 'Descrição',
        relativeCapacity: 'Relativo?', gliph: 'FF',
        applicated: true,
        imageUrl: '',
      }];
      return newThings;
    });
  }

  useEffect(() => {
    setThings(prevThings => {
      const newThings = prevThings.filter(m => m.name !== '');
      if(prevThings.length != newThings.length){
        return newThings;
      }
      return prevThings
    });
  }, [setThings, things])

  const handleNameChange = (index: number, value: string) => {
    const oldValue = things[index].name;
    while(value != oldValue && someMinuceOrThingHasThisName(user, value)) {
      value += '*'
    }
    setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].name = value;
      return newThings;
    });
    for (const mod of user.currentMods) {
      if(mod.origin === oldValue){
        mod.origin = value
      }
    }
  };

  const handleGlyphChange = (index: number, value: string) => {
    setThings(prevThings => {
      if(!GliphConst.includes(value as Gliph) && value!='') { return prevThings }
      const newThings = [...prevThings];
      newThings[index].gliph = value as Gliph;
      return newThings;
    });
  };

  const handleEquipedToggled = (index: number) => {
    setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].applicated = ! newThings[index].applicated;
      return newThings;
    });
  };

  const handleRelativeChange = (index: number, value: string) => {
    setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].relativeCapacity = value;
      return newThings;
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].description = value;
      return newThings;
    });
  };

  const getIsOkGliph = (thing: Thing): boolean => {
    if(!thing.relativeCapacity || !thing.gliph) { return true }
    const capGliph = getGliphFromCapacityName(user, thing.relativeCapacity)
    if(capGliph) {
      return isGliphInConformity(capGliph, thing.gliph)
    } else {
      return true
    }
  }

  const handleModificationChange: (index: number) => (v: Modification[]) => void = (index: number) => {
    return (v:Modification[]) => setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].modifications = v;
      return newThings;
    })
  }

  return (
    <div className="list">
      <div className='limited'>
        <h2 className="list-heading">Coisas</h2>
          {things.map((thing, index)=>{
            return <ul key={`${thing.name}-${Math.random()}`}>
              <EditableText
                text={thing.name}
                dataSetter={(value: string) => {handleNameChange(index, value)}}
                className='principal-minuce-text'
                callBackWhenUpDownArrowPressed={(isUp) => changeOrderInArray(isUp, index, setThings)}
              />
              {thing.relativeCapacity &&
              <EditableText
                text={thing.relativeCapacity}
                extraTextRender={(v)=>`[${v}]`}
                dataSetter={(value: string) => {handleRelativeChange(index, value)}}
                className='secondary-minuce-text'
              />
              }
              <EditableText
                text={thing.description}
                dataSetter={(value: string) => {handleDescriptionChange(index, value)}}
                className='attribute-text'
                ignoreEnter={true}
              />
              <ImageOfItem
                setItems={setThings as React.Dispatch<React.SetStateAction<Item[]>>}
                items={things}
                itemIndex={index}
              />
              {thing.gliph &&
                <EditableText
                  text={thing.gliph}
                  dataSetter={(value: string) => {handleGlyphChange(index, value)}}
                  className={`anti-margin list-atr-p ${getIsOkGliph(thing) ? '' : 'bad-gliph-effect'}`}
                />
              }
              <p className='anti-margin italic'>{isGliphInRegularity(thing.gliph, getGliphFromCapacityName(user, thing.relativeCapacity, true))}</p>
              <button onClick={()=>handleEquipedToggled(index)}>{thing.applicated ? 'Equipado' : 'Desequipado'}</button>
              <ModPlayerHandler user={user} target={thing} setTarget={handleModificationChange(index)} setUser={setUser} />
            </ul>
        })}
        <button onClick={addNewThing}>Adicionar Mais</button>
      </div>
    </div>
    );
};


export default Things;