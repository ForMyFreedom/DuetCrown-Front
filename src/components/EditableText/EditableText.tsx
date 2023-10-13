import React, { useState, useRef, useEffect } from 'react';
import './EditableText.css';

type EditableTextProps = React.HTMLAttributes<HTMLDivElement> & {
    text: string;
    dataSetter: (value: string) => void;
    extraTextRender?: (value: string) => string;
    filter?: (value: string) => string;
    ignoreEnter?: boolean;
};

const EditableText: React.FC<EditableTextProps> = ({ text, filter, dataSetter, extraTextRender, ignoreEnter, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const textareaRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        setEditedText(text)
    }, [text])


    const handleTextClick = () => {
        if(spanRef.current) {
            setWidth(spanRef.current.offsetWidth)
            setHeight(spanRef.current.offsetHeight)
        }
        setIsEditing(true);
    };

    const getFinalText = () => {
        if (extraTextRender) {
            return extraTextRender(editedText);
        }
        return editedText;
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(filter) {
            setEditedText(filter(event.target.value));
        } else {
            setEditedText(event.target.value);
        }
    };


    const handleTextBlur = () => {
        setIsEditing(false);
        dataSetter(editedText)
    };


    useEffect(() => {
        if (textareaRef.current) {
            const style = getComputedStyle(textareaRef.current)
            const extraOffset = Number(style.getPropertyValue('--customExtraOffset'))
            textareaRef.current.style.width = `${width+10+extraOffset}px`;
            textareaRef.current.style.height = `${height}px`;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(0, 0);
            textareaRef.current.select();
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if ((!ignoreEnter && event.key === 'Enter') || event.key === 'Escape') {
                textareaRef.current?.blur()
            }
        };
    
        if (textareaRef.current) {
            if(isEditing) {
                textareaRef.current.addEventListener('keydown', handleKeyDown);
            } else {
                textareaRef.current.removeEventListener('keydown', handleKeyDown);
            }
        }
    }, [height, ignoreEnter, isEditing, width])

    return (
        <div className="editable-text">
            {isEditing ? (
                <textarea
                    value={editedText}
                    className={`editable-text-area ${props.className}`}
                    onChange={handleTextChange}
                    ref={textareaRef}
                    onClick={(event) => event.stopPropagation()}
                    onBlur={handleTextBlur}
                />
            ) : (
                <span ref={spanRef} className={props.className} onClick={handleTextClick}>{getFinalText()}</span>
            )}
        </div>
    );
};

export default EditableText;