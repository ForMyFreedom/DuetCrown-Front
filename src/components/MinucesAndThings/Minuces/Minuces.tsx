import React, { useEffect, useState } from 'react';
import '../MinucesAndThings.css'
import { Modification, Player } from '../../../UserDomain'
import EditableText from '../../EditableText/EditableText';
import { changeOrderInArray, isEqualArray, someMinuceOrThingHasThisName } from '../../../utils';
import ModPlayerHandler from '../../ModPlayerHandler/ModPlayerHandler';
import ImageOfItem, { Item } from '../../ImageOfItem/ImageOfItem';

type Props = {
    user: Player;
    setUser: React.Dispatch<React.SetStateAction<Player>>
};

const Minuces: React.FC<Props> = ({ user, setUser }) => {
  const [minucies, setMinucies] = useState(user.minucies)

  useEffect(()=>{
    setMinucies(prevMinu => {
      return isEqualArray(prevMinu, user.minucies) ? prevMinu : user.minucies
    })
  }, [user.minucies])

  useEffect(() => {
    setUser(prevUser => {
      const newUser = { ...prevUser, minucies };
      return newUser;
    });
  }, [minucies, setUser]);

  const addNewMinuce = () => {
    setMinucies(prevMinucies => {
      const newMinucies = [...prevMinucies, {name: 'Traço', relative: 'Relativo?', description: 'Descrição', applicated: true, imageUrl: ''}];
      return newMinucies;
    });
  }

  useEffect(() => {
    setMinucies(prevMinuces => {
      const newMinuces = prevMinuces.filter(m => m.name !== '');
      if(prevMinuces.length != newMinuces.length){
        return newMinuces;
      }
      return prevMinuces
    });
  }, [setMinucies, minucies]);


  const handleNameChange = (index: number, value: string) => {
    const oldValue = minucies[index].name;
    while(someMinuceOrThingHasThisName(user, value)) {
      value += '*'
    }
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].name = value;
      return newMinuces;
    });
    for (const mod of user.currentMods) {
      if(mod.origin === oldValue){
        mod.origin = value
      }
    }
  };

  const handleRelativeChange = (index: number, value: string) => {
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].relative = value;
      return newMinuces;
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].description = value;
      return newMinuces;
    });
  };

  const handleEquipedToggled = (index: number) => {
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].applicated = !newMinuces[index].applicated;
      return newMinuces;
    });
  }

  const handleModificationChange: (index: number) => (v: Modification[]) => void = (index: number) => {
    return (v:Modification[]) => setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].modifications = v;
      return newMinuces;
    })
  }

  return (
    <div className="list">
      <div className='limited'>
        <h2 className="list-heading">Minúcias</h2>
          {minucies.map((minucie, index)=>{
            return <ul key={`${minucie.name}-${Math.random()}`}>
              <EditableText
                text={minucie.name}
                dataSetter={(value: string) => {handleNameChange(index, value)}}
                className='principal-minuce-text'
                callBackWhenUpDownArrowPressed={(isUp) => changeOrderInArray(isUp, index, setMinucies)}
              />
              {minucie.relative &&
              <EditableText
                text={minucie.relative}
                extraTextRender={(v)=>`[${v}]`}
                dataSetter={(value: string) => {handleRelativeChange(index, value)}}
                className='secondary-minuce-text'
              />
              }
              <EditableText
                text={minucie.description}
                dataSetter={(value: string) => {handleDescriptionChange(index, value)}}
                className='attribute-text'
                ignoreEnter={true}
              />
              <ImageOfItem
                setItems={setMinucies as React.Dispatch<React.SetStateAction<Item[]>>}
                items={minucies}
                itemIndex={index}
                style={{marginBottom: '1rem'}}
              />
              <button onClick={()=>handleEquipedToggled(index)}>{minucie.applicated ? 'Aplicado' : 'Não Aplicado'}</button>
              <ModPlayerHandler user={user} target={minucie} setTarget={handleModificationChange(index)} setUser={setUser}/>
            </ul>
          })}
          <button onClick={addNewMinuce}>Adicionar Mais</button>
      </div>
    </div>
    );
};


export default Minuces;