import { ExtendedSignal, Gliph, GliphConst, Modification, SignalsConst, Stat, modifySignal, sumSignal } from '../../../UserDomain';
import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import React, { ReactElement, useEffect, useState } from 'react'
import { LevelMeaning, rollValueAgaintChallenge } from './definitions';
import { generalTranslator } from '../Definitions';


type UnitKind ={name: 'capacity'} | {name: 'stat', stat: Stat['kind']}

type Props =  React.HTMLAttributes<HTMLDivElement> & {
    name: string
    value: Gliph;
    challenge: Gliph
    editable: boolean
    rolable?: boolean
    kind: UnitKind
    modifications: Modification[]
    setMods: (mods: Modification[])=>void
    setAttributeValue: (v: Gliph) => void
    setCifraResult: (v: string) => void
    setTextResult: (v: string) => void
    setExtraResult: (v: string) => void
    setAttributeName?: (v: string) => void
    rollCountDuo: [number, React.Dispatch<React.SetStateAction<number>>]
    bottomComponent?: ReactElement
};

const UnitAtribute: React.FC<Props> = ({ name, setAttributeName, kind, value, challenge, editable, setAttributeValue, setCifraResult, setTextResult, setExtraResult, rollCountDuo, rolable=true, bottomComponent, modifications, setMods, ...props }) => {
    const [rollCount, setRollCount] = rollCountDuo
    const [tempMod, setTempMod] = useState<ExtendedSignal>('')

    useEffect(()=>{
        const mod = findBasicMod(modifications, kind, name, false)
        if(mod) {
            setTempMod(mod.value)
        } else {
            setTempMod('')
        }
    },[kind, modifications, name])
    
    function alterMod(direction: number) {
        const newMods = [...modifications]
        const curretMod = findBasicMod(newMods, kind, name)
        if(curretMod){
            curretMod.value = modifySignal(curretMod.value, direction)
        } else {
            newMods.push({
                origin: '*',
                kind: kind.name,
                keywords: (kind.name == 'capacity') ? [name] : [name, kind.stat],
                value: direction == 1 ? '+' : '-'
            })
        }
        setMods(newMods)
    }

    const decrease = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf>0) {
            setAttributeValue(GliphConst[indexOf-1])
            return true
        }
        return false
    }
    
    const canIncrease = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        return indexOf<GliphConst.length-1
    }

    const canDecrease = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        return indexOf>0
    }

    const increase = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf<GliphConst.length-1) {
            setAttributeValue(GliphConst[indexOf+1])
            return true
        }
        return false
    }

    const roll = () => {
        rollValueAgaintChallenge(
            value, challenge, rollCount,
            setExtraResult, setCifraResult, setTextResult, setRollCount
        )
    }

    const tempDecrease = () => {
        if(!canDecrease()){ return }
        alterMod(-1)
    }

    const tempIncrease = () => {
        if(!canIncrease()){ return }
        alterMod(1)
    }

    const naming = (v: string) => {
        if(kind.name === 'capacity') {
            return generalTranslator(v)
        } else {
            return `${generalTranslator(v)} [${kind.stat}]`
        }
    }

    return (
        <div className={`grid-item ${props.className}`}>
            {editable ?
            <EditableText
                className='list-atr-div-b'
                text={naming(name)}
                dataSetter={(v:string)=>{setAttributeName ? setAttributeName(v) : {}}}
            />
            :
            <b>{naming(name)}: </b>
            }
            <div className='internal-grid-item'>
                <button className='temp-mod-button' onClick={tempDecrease}>⊖</button>
                <button onClick={decrease}>-</button>
                <p onClick={rolable ? roll : () => {}} className={rolable ? 'grid-item-p-hover' : ''}>{value}</p>
                <button onClick={increase}>+</button>
                <button className='temp-mod-button' onClick={tempIncrease}>⊕</button>
            </div>
            <h3 className='level-description'>{LevelMeaning[value]}</h3>
            {SignalsConst &&
                <p className='current-mod'>{tempMod}</p>
            }
            {bottomComponent}
        </div>
    )
}

function findBasicMod(modList: Modification[], kind: UnitKind, name: string, relevantOrigin: boolean = true): Modification|undefined{
    let result: Modification[]
    if(kind.name === 'capacity') {
        result = modList.filter(mod =>
            mod.kind=='capacity' && mod.keywords[0] === name && (!relevantOrigin || mod.origin === '*')
        )
    } else {
        result = modList.filter(mod =>
            mod.kind=='stat' && mod.keywords[0] === name && mod.keywords[1] === kind.stat && (!relevantOrigin || mod.origin === '*')
        )
    }
    if(result.length == 0) { return undefined }
    if(relevantOrigin){
        return result[0]
    } else {
        console.log(result)
        const aggregated: Modification = {...result[0]}
        aggregated.value=''
        for(const mod of result){
            aggregated.value = sumSignal(aggregated.value, mod.value)
        }
        return aggregated
    }
}

export default UnitAtribute