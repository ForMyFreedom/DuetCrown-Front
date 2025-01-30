import { Gliph, GliphConst } from '../../../UserDomain';
import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import { LevelMeaning } from './definitions';

type Props = {
    value: Gliph;
    customTitle?: string
    setValue: (v: Gliph) => void
    setExtraAdvantage: (v: number) => void
};

const UnitChallenge: React.FC<Props> = ({ value, setValue, customTitle, setExtraAdvantage }) => {
    const decrease = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf>0) {
            setValue(GliphConst[indexOf-1])
        }
    }

    const increase = () => {
        const indexOf = GliphConst.indexOf(value as Gliph)
        if(indexOf<GliphConst.length-1) {
            setValue(GliphConst[indexOf+1])
        }
    }

    const handleChangeExtraAdvantage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtraAdvantage(Number(event.target.value))
    }

    return (
        <div className="grid-item">
            <b>{customTitle || 'Desafio:'}</b>
            <div className='internal-grid-item'>
                <button onClick={decrease}>-</button>
                <EditableText
                    className='list-atr-p margin-auto' text={value} dataSetter={setValue as (v: string) => void} filter={(v: string) => v.toUpperCase()}
                />
                <button onClick={increase}>+</button>
            </div>
            <input type='number' className='extra-advantage-input' placeholder='Vantagem Extra' onChange={handleChangeExtraAdvantage}/>
            <h3 className='level-description'>{LevelMeaning[value]}</h3>
        </div>
    )
}


export default UnitChallenge