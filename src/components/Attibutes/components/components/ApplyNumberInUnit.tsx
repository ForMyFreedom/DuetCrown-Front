import { useState, ReactElement } from 'react';
import '../UnitAtribute.css'

type Props = {
    data: number
    setData: (v: number) => void
    decrease: () => void
    increase: () => void
    editableText: ReactElement|undefined
};

const ApplyNumberInUnit: React.FC<Props> = ({ data, setData, decrease, increase, editableText }) => {
    const [isHolding, setIsHolding] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [mod, setMod] = useState<number|string>(-2)
    let timeoutId: number;

    const update = () => {
        if(!isNaN(Number(mod))) {
            setData(data + Number(mod))
        }
        setIsUpdateModalOpen(false)
        setIsHolding(false)
    }

    const verifyHold = (mod: number) => {
        timeoutId = setTimeout(() => {
            if(isUpdateModalOpen) { return }
            setIsHolding(true)
            setIsUpdateModalOpen(true)
            setMod(mod)
        }, 750);
    }

    const removeHold = (codeFuction: ()=>void) => {
        if(isHolding && isUpdateModalOpen) { return }
        if(!isHolding){
            clearTimeout(timeoutId)
            codeFuction()
        }
        setIsHolding(false)
    }

    const handleChangeMod = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value == '') {
            return setMod('');
        }
        if (event.target.value == '-') {
            return setMod('-');
        }
        setMod(Number(event.target.value));
        setIsHolding(false)
    }

    return (
        <>
            {isUpdateModalOpen &&
                <div className='update-modal'>
                    <input min={-100} value={mod} onChange={handleChangeMod} type='text' inputMode='numeric' />
                    <button onClick={update}>Update</button>
                </div>
            }
            <div className='internal-grid-item'>
                <button onMouseDown={()=>verifyHold(-1)} onMouseUp={()=>removeHold(decrease)}>-</button>
                {editableText}
                <button onMouseDown={()=>verifyHold(1)} onMouseUp={()=>removeHold(increase)}>+</button>
            </div>
        </>
    )
}



export default ApplyNumberInUnit