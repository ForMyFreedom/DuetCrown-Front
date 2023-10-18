import React, { useEffect, useState } from 'react';
import '../MinucesAndThings.css'
import { Player } from '../../../UserDomain'
import EditableText from '../../EditableText/EditableText';

type Props = {
    user: Player;
    setUser: React.Dispatch<React.SetStateAction<Player>>
};

const Minuces: React.FC<Props> = ({ user, setUser }) => {
  const [minucies, setMinucies] = useState(user.minucies)

  useEffect(()=>{
    setMinucies(user.minucies)
  }, [user.minucies])

  useEffect(() => {
    setUser(prevUser => {
      const newUser = { ...prevUser, minucies };
      return newUser;
    });
  }, [minucies, setUser]);

  const addNewMinuce = () => {
    setMinucies(prevMinucies => {
      const newMinucies = [...prevMinucies, {name: 'Item', extraName: 'Tipo', description: 'Descrição'}];
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
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].name = value;
      return newMinuces;
    });
  };

  const handleExtraNameChange = (index: number, value: string) => {
    setMinucies(prevMinuces => {
      const newMinuces = [...prevMinuces];
      newMinuces[index].extraName = value;
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

  return (
    <div className="list">
      <h2 className="list-heading">Minúcias</h2>
        {minucies.map((minucie, index)=>{
          return <ul key={`${minucie.name}-${Math.random()}`}>
            <EditableText
              text={minucie.name}
              dataSetter={(value: string) => {handleNameChange(index, value)}}
              className='principal-minuce-text'
            />
            {minucie.extraName &&
            <EditableText
              text={minucie.extraName}
              extraTextRender={(v)=>`[${v}]`}
              dataSetter={(value: string) => {handleExtraNameChange(index, value)}}
              className='secondary-minuce-text'
            />
            }
            <EditableText
              text={minucie.description}
              dataSetter={(value: string) => {handleDescriptionChange(index, value)}}
              className='attribute-text'
            />
          </ul>
        })}
        <button onClick={addNewMinuce}>Add More</button>
    </div>
    );
};

export default Minuces;