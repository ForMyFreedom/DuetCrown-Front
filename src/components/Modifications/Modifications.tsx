import React from 'react';
import './Modifications.css'
import { Modification, Player } from '../../UserDomain'
import { generalTranslator } from '../Attibutes/Definitions';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  user: Player;
};

const Modifications: React.FC<Props> = ({ user }) => {
  const showThatMod = (index: number, mod: Modification) => {
    const modCopy = {...mod}
    if(modCopy.origin == '*'){
      modCopy.origin = '(Definida pelo Jogador)'
    }

    modCopy.keywords[0] = generalTranslator(modCopy.keywords[0])
    const isStat = modCopy.kind == 'stat'

    return (
      <div className='mod-box' key={index}>
        <p>{modCopy.origin}</p>
        <p>{modCopy.keywords[0]} {(isStat ? `[${modCopy.keywords[1]}]` : '')} {modCopy.value}</p>
      </div>
    )
  }

  return (
    <div className="full-box">
      <div className="list-atr">
        <h2 key='list-heading' className="list-heading">Modificações</h2>
        {user.currentMods.map((mod, index) => showThatMod(index, mod))}
      </div>
    </div>
  );
};

export default Modifications;