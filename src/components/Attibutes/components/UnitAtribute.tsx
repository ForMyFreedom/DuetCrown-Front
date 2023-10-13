import { Gliph, GliphConst } from '../../../UserDomain';
import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import { ReactElement } from 'react'
import { LevelMeaning, rollValueAgaintChallenge } from './definitions';

type Props =  React.HTMLAttributes<HTMLDivElement> & {
    name: string
    value: Gliph;
    challenge: Gliph
    editable: boolean
    rolable?: boolean
    setAttributeValue: (v: Gliph) => void
    setCifraResult: (v: string) => void
    setTextResult: (v: string) => void
    setExtraResult: (v: string) => void
    setAttributeName?: (v: string) => void
    rollCountDuo: [number, React.Dispatch<React.SetStateAction<number>>]
    bottomComponent?: ReactElement
};

const UnitAtribute: React.FC<Props> = ({ name, setAttributeName, value, challenge, editable, setAttributeValue, setCifraResult, setTextResult, setExtraResult, rollCountDuo, rolable=true, bottomComponent, ...props }) => {
    const [rollCount, setRollCount] = rollCountDuo

    const decrease = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf>0) {
            setAttributeValue(GliphConst[indexOf-1])
        }
    }
    
    const increase = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf<GliphConst.length-1) {
            setAttributeValue(GliphConst[indexOf+1])
        }
    }

    const roll = () => {
        rollValueAgaintChallenge(
            value, challenge, rollCount,
            setExtraResult, setCifraResult, setTextResult, setRollCount
        )
    }

    return (
        <div className={`grid-item ${props.className}`}>
            {editable ?
            <EditableText
                className='list-atr-div-b'
                text={name}
                dataSetter={(v:string)=>{setAttributeName ? setAttributeName(v) : {}}}
            />
            :
            <b>{name}: </b>
            }
            <div className='internal-grid-item'>
                <button onClick={decrease}>-</button>
                <p onClick={rolable ? roll : () => {}} className={rolable ? 'grid-item-p-hover' : ''}>{value}</p>
                <button onClick={increase}>+</button>
            </div>
            <h3 className='level-description'>{LevelMeaning[value]}</h3>
            {bottomComponent}
        </div>
    )
}

export default UnitAtribute