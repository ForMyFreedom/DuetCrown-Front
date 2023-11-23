import { Gliph } from '../../../UserDomain';
import './UnitAtribute.css'
import { rollValueAgaintChallenge } from './definitions';

type Props =  React.HTMLAttributes<HTMLDivElement> & {
    value: Gliph;
    challenge: Gliph
    setCifraResult: (v: string) => void
    setTextResult: (v: string) => void
    setExtraResult: (v: string) => void
    rollCountDuo: [number, React.Dispatch<React.SetStateAction<number>>]
};

const UnitButtonRoll: React.FC<Props> = ({ value, challenge, setCifraResult, setTextResult, setExtraResult, rollCountDuo, className }) => {
    const [rollCount, setRollCount] = rollCountDuo

    const roll = () => {
        rollValueAgaintChallenge(
            value, challenge, rollCount,
            setExtraResult, setCifraResult, setTextResult, setRollCount
        )
    }

    return (
        <button onClick={roll} className='unit-button-roll'>
            <p className={`grid-item-p-hover ${className}`}>Rolar</p>
        </button>
    )
}


export default UnitButtonRoll