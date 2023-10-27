import React, { useEffect, useState } from 'react';
import '../MinucesAndThings.css'
import { Gliph, GliphConst, Player, Thing, isGliphInConformity, isGliphInRegularity } from '../../../UserDomain'
import EditableText from '../../EditableText/EditableText';
import { getGliphFromCapacityName } from './definitions';
import { isEqualArray } from '../../../utils';

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
        name: 'Item', description: 'Descrição',
        relativeCapacity: 'Relativo?', gliph: 'FF',
        equiped: true,
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
  }, [setThings, things]);


  const handleNameChange = (index: number, value: string) => {
    setThings(prevThings => {
      const newThings = [...prevThings];
      newThings[index].name = value;
      return newThings;
    });
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
      newThings[index].equiped = ! newThings[index].equiped;
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
    if(!thing.relativeCapacity || !thing.gliph) { return false }
    const capGliph = getGliphFromCapacityName(user, thing.relativeCapacity)
    if(capGliph) {
      return isGliphInConformity(capGliph, thing.gliph)
    } else {
      return false
    }
  }

  return (
    <div className="list">
      <h2 className="list-heading">Coisas</h2>
        {things.map((thing, index)=>{
          return <ul key={`${thing.name}-${Math.random()}`}>
            <EditableText
              text={thing.name}
              dataSetter={(value: string) => {handleNameChange(index, value)}}
              className='principal-minuce-text'
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
              className='attribute-text-2'
            />
            {thing.gliph &&
              <EditableText
                text={thing.gliph}
                dataSetter={(value: string) => {handleGlyphChange(index, value)}}
                className={`list-atr-p ${getIsOkGliph(thing) ? '' : 'bad-gliph-effect'}`}
              />
            }
            <span className='italic'>{isGliphInRegularity(thing.gliph, getGliphFromCapacityName(user, thing.relativeCapacity))}</span>
            <button onClick={()=>handleEquipedToggled(index)}>{thing.equiped ? 'Equipado' : 'Desequipado'}</button>
          </ul>
        })}
        <button onClick={addNewThing}>Add More</button>
    </div>
    );
};

export default Things;