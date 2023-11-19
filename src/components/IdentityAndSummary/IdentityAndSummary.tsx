import React, { useEffect, useState } from 'react';
import { Player, StringRelation } from '../../UserDomain'
import './IdentityAndSummary.css'
import EditableText from '../EditableText/EditableText';
import { changeOrderInStringRelation, isEqualObject } from '../../utils';

type Dispatch<T> = React.Dispatch<React.SetStateAction<T>>

type Props = {
    user: Player;
    setUser: Dispatch<Player>
};


const IdentityAndSummary: React.FC<Props> = ({ user, setUser }) => {
  const [identity, setIdentity] = useState(user.identity)
  const [summary, setSummary] = useState(user.sumary)

  useEffect(() => {
    setUser(prevUser => {
      prevUser.identity = identity;
      return {...prevUser}
    })
  }, [identity, setUser])

  useEffect(() => {
    setUser(prevUser => {
      prevUser.sumary = summary;
      return {...prevUser}
    })
  }, [summary, setUser])

  useEffect(() => {
    setIdentity(prevIdentity => {
      const newIden = Object.entries(prevIdentity).filter(m => m[0] !== '');
      if(Object.entries(prevIdentity).length != newIden.length){
        return Object.fromEntries(newIden);
      }
      return prevIdentity
    });
  }, [setIdentity, identity]);

  useEffect(() => {
    setSummary(prevSum => {
      const newSummary = Object.entries(prevSum).filter(m => m[0] !== '');
      if(Object.entries(prevSum).length != newSummary.length){
        return Object.fromEntries(newSummary);
      }
      return prevSum
    });
  }, [setSummary, summary]);

  useEffect(()=>{
    setIdentity(prevIden => {
      return isEqualObject(prevIden, user.identity) ? prevIden : user.identity
    })
  }, [user.identity])

  useEffect(()=>{
    setSummary(prevSumary => {
      return isEqualObject(prevSumary, user.sumary) ? prevSumary : user.sumary
    })
  }, [user.sumary])



  const addMoreIdentity = () => {
    setIdentity(prevIdentity => {
      const newIdentity = {...prevIdentity,
        [`Identidade ${Object.keys(prevIdentity).length+1}`]: 'Insira o texto'
      }
      return newIdentity;
    })
  }

  const addMoreSummary = () => {
    setSummary(prevSummary => {
      const newSummary = {...prevSummary,
        [`Sumário ${Object.keys(prevSummary).length+1}`]: 'Insira o texto'
      }
      return newSummary;
    })
  }

  const handleChangeKey = (setGroup: Dispatch<StringRelation>, key: string, newKey: string) => {
    setGroup(prevGroup => {
      if(key==newKey) return prevGroup;
      const newGroup = {...prevGroup};
      newGroup[newKey] = newGroup[key];
      const entries = Object.entries(newGroup).filter(([k]) => k != key)
      return Object.fromEntries(entries);
    })
  }

  const genericMapper = (group: StringRelation, setGroup: Dispatch<StringRelation>, key: string, value: string, index: number) => {
    return (
      <div className='between-identity' key={`${key}-${index}`}>
        <EditableText
          text={key}
          dataSetter={(newKey: string) => handleChangeKey(setGroup, key, newKey)}
          className='attribute-text bold'
          callBackWhenUpDownArrowPressed={(isUp) => changeOrderInStringRelation(isUp, index, group, setGroup)}
        />
        <EditableText
          text={value}
          dataSetter={(newValue: string) => group[key] = newValue}
          className='attribute-text text-wrap'
          ignoreEnter={true}
        />
      </div>
    )
  }

  return (
      <div className="half-box">
        <div className="list">
          <h2 className="list-heading">Identidade</h2>
          {Object.entries(user.identity).map(([key, value], index) =>
            genericMapper(identity, setIdentity, key, value, index)
          )}
          <button onClick={addMoreIdentity} className='more-button--identity'>Mais</button>
        </div>
        <div className="list">
          <h2 className="list-heading">Sumário</h2>
          {Object.entries(user.sumary).map(([key, value], index) =>
            genericMapper(summary, setSummary, key, value, index)
          )}
          <button onClick={addMoreSummary} className='more-button--identity'>Mais</button>
        </div>
      </div>
  );
};

export default IdentityAndSummary;