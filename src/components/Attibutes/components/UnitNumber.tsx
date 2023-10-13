import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import { ReactElement } from 'react'
import ApplyNumberInUnit from './components/ApplyNumberInUnit';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    title: string
    data: number
    setData: (v: number) => void
    bottomComponent?: ReactElement
};

const UnitNumber: React.FC<Props> = ({ data, title, setData, bottomComponent, ...props }) => {
    const decrease = () => {
        setData(data-1)
    }

    const increase = () => {
        setData(data+1)
    }

    return (
        <div className={`challenge ${props.className}`}>
            <div className="grid-item">
                <b>{title}: </b>
                    <ApplyNumberInUnit
                        data={data}
                        setData={setData}
                        decrease={decrease}
                        increase={increase}
                        editableText={
                            <EditableText
                                className='list-atr-p margin-auto' text={String(data)}
                                extraTextRender={(v: string) => v+'%'}
                                filter={(v: string) => v.replace(/\D/g, '')}
                                dataSetter={(v: string) => setData(Number(v))}
                            />
                        }
                    />
            {bottomComponent}
            </div>
        </div>
    )
}



export default UnitNumber