import React, { useState, useEffect } from 'react';
import './EvolutionsAndExtensions.css'
import { Extension, Gliph, Player, Signal } from '../../UserDomain'
import UnitNumber from '../Attibutes/components/UnitNumber';
import UnitNumberAndGlyph from '../Attibutes/components/UnitNumberAndGlyph';

type Props = {
    user: Player;
    setUser: React.Dispatch<React.SetStateAction<Player>>
};

const EvolutionsAndExtensions: React.FC<Props> = ({ user, setUser }) => {
  const [extensions, setExtensions] = useState(user.extensions);

  const handleExtensionNameChange = (index: number, name: string) => {
    setExtensions(prevExtensions => {
      const newExtensions = [...prevExtensions];
      newExtensions[index].name = name;
      return newExtensions;
    });
  };

  const handleExtensionKindChange = (index: number, kind: string) => {
    setExtensions(prevExtensions => {
      const newExtensions = [...prevExtensions];
      newExtensions[index].kind = kind;
      return newExtensions;
    });
  };

  const handleExtensionProgressChange = (index: number, progress: number) => {
    setExtensions(prevExtensions => {
      const newExtensions = [...prevExtensions];
      newExtensions[index].progress = progress;
      return newExtensions;
    });
  };

  const handleExtensionValueChange = (index: number, value: string) => {
    setExtensions(prevExtensions => {
      const newExtensions = [...prevExtensions];
      newExtensions[index].value = value as Gliph|Signal;
      return newExtensions;
    });
  };

  useEffect(() => {
    setUser(prevUser => {
      const newUser = { ...prevUser, extensions };
      return newUser;
    });
  }, [extensions, setUser]);


  const addNewExtension = (value: Gliph|Signal) => {
    setExtensions(prevExtensions => {
      const newExtensions: Extension[] = [...prevExtensions, {
        name: 'Nome',
        kind: 'Tipo',
        progress: 0,
        value: value
      }];
      return newExtensions;
    });
  }

  const addNewBasicExtension = () => addNewExtension('')
  const addNewGlyphExtension = () => addNewExtension('FF')


  useEffect(() => {
    setExtensions(prevExtensions => {
      const newExtensions = prevExtensions.filter(m => m.name !== '');
      if(prevExtensions.length != newExtensions.length){
        return newExtensions;
      }
      return prevExtensions
    });
  }, [setExtensions, extensions]);

  return (
      <div className="half-box">
        <div className="list">
          <h2 className="list-heading">Evoluções</h2>
          <div>
            <UnitNumber
              title='Evolução Mundana'
              data={user.evolutions.physical}
              setData={(v: number)=>{setUser({...user, evolutions: {...user.evolutions, physical: v} })}}
            />
          </div>
          <div>
            <UnitNumber
              title='Evolução Especial'
              data={user.evolutions.espiritual}
              setData={(v: number)=>{setUser({...user, evolutions: {...user.evolutions, espiritual: v} })}}
            />
          </div>
        </div>
        <div className="list">
          <h2 className="list-heading">Extensões</h2>
          {extensions.map((extension, index) => {
              return <div key={`${extension.name} [${extension.kind}]`}>
                <UnitNumberAndGlyph
                  text={{main: extension.name, second: extension.kind}}
                  setText={{main: (v: string) => handleExtensionNameChange(index, v), second: (v: string) => handleExtensionKindChange(index, v)}}
                  progress={extension.progress} value={extension.value}
                  setProgress={(value: number) => handleExtensionProgressChange(index, value)}
                  setValue={(value: string) => handleExtensionValueChange(index, value)}
                />
            </div>
          })}
          <div className='button-group-extension'>
            <button onClick={() => addNewBasicExtension()}>Add More Basic</button>
            <button onClick={() => addNewGlyphExtension()}>Add More Glyph</button>
          </div>
     </div>
      </div>
    );
};

export default EvolutionsAndExtensions;