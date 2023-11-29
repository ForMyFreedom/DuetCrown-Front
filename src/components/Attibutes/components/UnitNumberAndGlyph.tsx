import { GliphConst, Gliph, ExtendedSignal, SignalsConst } from '../../../UserDomain';
import EditableText from '../../EditableText/EditableText';
import './UnitAtribute.css'
import ApplyNumberInUnit from './components/ApplyNumberInUnit';

type Props = {
    text: {main: string, second: string}
    setText: {main: (v: string)=>void, second: (v:string)=>void}
    progress: number
    setProgress: (v: number) => void
    value: string
    dataFilter: (v: string) => string
    setValue: (v: string) => void
    callBackWhenUpDownArrowPressed?: (isUp: boolean) => void;
};

const UnitNumberAndGlyph: React.FC<Props> = ({ dataFilter, callBackWhenUpDownArrowPressed, text, setText, progress, value, setProgress, setValue}) => {
    const decrease = () => {
        const result = progress-1
        setProgress(result)

        if(!GliphConst.includes(value as Gliph)) {
            const signal = value as ExtendedSignal

            const isLowestSignal = SignalsConst.indexOf(signal)==0
            if (result < 0 && !isLowestSignal) {
                const lastSignal = SignalsConst[SignalsConst.indexOf(signal)-1]
                setValue(lastSignal)
                setProgress(100)
            }
        } else {
            const gliph = value as Gliph

            const isLowestGlyph = GliphConst.indexOf(gliph)==0
            if (result < 0 && !isLowestGlyph) {
                const lastGlyph = GliphConst[GliphConst.indexOf(gliph)-1]
                setValue(lastGlyph)
                setProgress(100)
            }
        }
    }

    const increase = () => {
        const result = progress+1
        setProgress(result)

        if(!GliphConst.includes(value as Gliph)) {
            const signal = value as ExtendedSignal

            const isHighestSignal = SignalsConst.indexOf(signal)==SignalsConst.length-1
            if (result > 100 && !isHighestSignal) {
                const nextSignal = SignalsConst[SignalsConst.indexOf(signal)+1]
                setValue(nextSignal)
                setProgress(0)
            } 
        } else {
            const gliph = value as Gliph

            const isHighestGlyph = GliphConst.indexOf(gliph)==GliphConst.length-1
            if (result > 100 && !isHighestGlyph) {
                const nextGlyph = GliphConst[GliphConst.indexOf(gliph)+1]
                setValue(nextGlyph)
                setProgress(0)
            }   
        }
    }

    return (
        <div className='challenge'>
            <div className="grid-item minify">
                <div>
                    <EditableText
                        text={text.main}
                        className='grid-item-b'
                        dataSetter={(v: string) => {setText.main(v)}}
                        callBackWhenUpDownArrowPressed={callBackWhenUpDownArrowPressed}
                    />
                    <EditableText
                        text={text.second}
                        className='grid-item-b'
                        extraTextRender={(v:string) => `[${v}]`}
                        dataSetter={(v: string) => {setText.second(v)}}
                    />
                </div>
                <ApplyNumberInUnit
                    data={progress}
                    setData={setProgress}
                    decrease={decrease}
                    increase={increase}
                    editableText={
                        <>
                        <EditableText
                            className='list-atr-p margin-auto' text={String(progress)}
                            extraTextRender={(v: string) => v+'%'}
                            filter={(v: string) => v.replace(/\D/g, '')}
                            dataSetter={(v: string) => setProgress(Number(v))}
                        />
                        <EditableText
                            className='big-text' text={value}
                            filter={dataFilter}
                            dataSetter={(v: string) => setValue(v)}
                        />
                        </>
                    }
                />
            </div>
        </div>
    )
}



export default UnitNumberAndGlyph