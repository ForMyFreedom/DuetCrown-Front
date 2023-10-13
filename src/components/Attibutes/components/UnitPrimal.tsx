import { Capacities, Player } from '../../../UserDomain';
import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import ApplyNumberInUnit from './components/ApplyNumberInUnit';

export type PrimalKind = Capacities['primal']['kind']

type Props = {
    data: Player['capacities']['primal']
    setAttributeValue: (v: number) => void
    setKind: (v: PrimalKind) => void
};

const TRANSLATE_PRIMAL: {[T in PrimalKind]: string} = {
    Hope: 'Esperança',
    Despair: 'Desespero'
}

const UnitPrimal: React.FC<Props> = ({ data, setAttributeValue, setKind }) => {
    function verifyInversion(value: number) {
        if (value<0) {
            setAttributeValue(-value)
            setKind(data.kind == 'Despair' ? 'Hope' : 'Despair')
        }
    }

    const decrease = () => {
        const newValue = (data.kind=='Hope') ? data.value-1 : data.value+1 
        setAttributeValue(newValue)
        verifyInversion(newValue)
    }

    const dataSetter = (v: string) => {
        const value = Number(v)
        if (Number.isNaN(value)) {
            setAttributeValue(10)
        } else {
            setAttributeValue(value)
        }
        verifyInversion(value)
    }
    
    const increase = () => {
        const newValue = (data.kind=='Hope') ? data.value+1 : data.value-1 
        setAttributeValue(newValue)
        verifyInversion(newValue)
    }

    return (
        <div className='challenge'>
            <div className={`grid-item ${data.value >= 100 ? (data.kind == 'Hope' ? 'special-hope' : 'special-despair') : ''}`}>
                <b>{TRANSLATE_PRIMAL[data.kind]}: </b>
                <ApplyNumberInUnit
                    data={data.value}
                    setData={setAttributeValue}
                    decrease={decrease}
                    increase={increase}
                    editableText={
                        <EditableText
                            className='list-atr-p margin-auto' text={String(data.value)}
                            extraTextRender={(v: string) => v+'%'}
                            dataSetter={dataSetter}
                        />
                    }
                />
            </div>
        </div>
    )
}



export default UnitPrimal