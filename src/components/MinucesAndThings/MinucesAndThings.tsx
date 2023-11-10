import React from 'react';
import './MinucesAndThings.css'
import { Player } from '../../UserDomain'
import Minuces from './Minuces/Minuces';
import Things from './Things/Things';

type Props = {
    user: Player;
    setUser: React.Dispatch<React.SetStateAction<Player>>
};

const MinucesAndThings: React.FC<Props> = ({ user, setUser }) => {
  return (
      <div className="half-box">
          <Minuces user={user} setUser={setUser}/>
          <Things user={user} setUser={setUser}/>
      </div>
    );
};

export default MinucesAndThings;