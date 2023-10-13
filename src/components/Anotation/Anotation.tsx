import React from 'react';
import './Anotation.css'
import { Player } from '../../UserDomain'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  user: Player;
  setUser: React.Dispatch<React.SetStateAction<Player>>
};

const Anotation: React.FC<Props> = ({ user, setUser }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUser({...user, anotations: event.target.value})
  };

  return (
    <div className="full-box">
      <div className="list-atr">
        <h2 key='list-heading' className="list-heading">Anotações</h2>
        <textarea className='anotation-area' value={user.anotations} onChange={handleTextChange}/>
      </div>
    </div>
  );
};

export default Anotation;