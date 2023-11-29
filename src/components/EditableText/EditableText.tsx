/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import './EditableText.css';

type EditableTextProps = React.HTMLAttributes<HTMLDivElement> & {
    text: string;
    dataSetter: (value: string) => void;
    extraTextRender?: (value: string) => string;
    filter?: (value: string) => string;
    ignoreEnter?: boolean;
    fullWidth?: boolean,
    callBackWhenUpDownArrowPressed?: (isUp: boolean) => void;
    disabled?: boolean
};

const EditableText: React.FC<EditableTextProps> = ({ disabled, text, filter, dataSetter, extraTextRender, ignoreEnter, fullWidth, callBackWhenUpDownArrowPressed, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
    const [cancelEditing, setCancelEditing] = useState(false);
    const textareaRef = useRef<HTMLSpanElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    
    useEffect(() => {
        setEditedText(prevText => prevText !== text ? text : prevText)
    }, [text])
    
    const finalText = useMemo(() =>  {
        if (extraTextRender) {
            return extraTextRender(editedText);
        }
        return editedText;
    }, [editedText, extraTextRender])

    const handleTextBlur = () => {
        if(cancelEditing){
            setCancelEditing(false)
            return
        }
        setIsEditing(false);
        const finalText = filter
            ? filter(textareaRef.current?.innerText || '')
            : textareaRef.current?.innerText || ''

        dataSetter(finalText)
        setEditedText(finalText)
    };

    useEffect(()=>{
        if(cancelEditing){
            textareaRef.current?.blur()
        }
    }, [cancelEditing])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            if ((!ignoreEnter && event.key === 'Enter') || event.key === 'Escape') {
                textareaRef.current?.blur()
            }
            if(callBackWhenUpDownArrowPressed){
                if(event.key === 'ArrowUp'){
                    callBackWhenUpDownArrowPressed(true)
                    setCancelEditing(true)
                }
                if(event.key === 'ArrowDown'){
                    callBackWhenUpDownArrowPressed(false)
                    setCancelEditing(true)
                }
            }
        };
    
        if (textareaRef.current) {
            textareaRef.current.focus()
            selectComponent(textareaRef.current)
            if(isEditing) {
                textareaRef.current.addEventListener('keydown', handleKeyDown);
            } else {
                textareaRef.current.removeEventListener('keydown', handleKeyDown);
            }
        }
    }, [callBackWhenUpDownArrowPressed, ignoreEnter, isEditing])

    return (
        <div className="editable-text" style={fullWidth?{width: '100%'}:{}}>
            {isEditing ? (
                <span
                    contentEditable='plaintext-only'
                    className={`editable-text-area ${props.className}`}
                    ref={textareaRef}
                    onClick={(event) => event.stopPropagation()}
                    onBlur={handleTextBlur}
                    suppressContentEditableWarning={true}
                >
                    {editedText}
                </span>
            ) : (
                <span ref={spanRef} onClick={() => !disabled ? setIsEditing(true) : null} className={props.className}>{finalText}</span>
            )}
        </div>
    );
};

function selectComponent(component: HTMLElement) {
    const range = document.createRange();
    range.selectNodeContents(component);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
}

export default EditableText;