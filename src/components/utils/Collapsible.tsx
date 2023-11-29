import React, { useState } from 'react';
import './Collapsible.css'
import { generalTranslator } from '../Attibutes/Definitions';

interface CollapsibleProps {
    options: string[];
    setSelectedOption: (option: string) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({ options, setSelectedOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex,setCurrentIndex] = useState(0);

    const handleOptionClick = (index: number) => {
        setCurrentIndex(index)
        setSelectedOption(options[index])
        setIsOpen(false)
    }

    return (
        <div className='collapsible-father'>
            <div className='collapsible'>
                <button className='selected' onClick={() => setIsOpen(!isOpen)}>
                    {generalTranslator(options[currentIndex])}
                </button>
                {isOpen && options.map((option, index) => { 
                    if (index !== currentIndex) {
                        return <button key={index}
                            onClick={()=>handleOptionClick(index)}
                        >{generalTranslator(option)}</button>
                    }
                })}
            </div>
        </div>
    );
};

export default Collapsible;