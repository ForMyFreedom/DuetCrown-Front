import React, { useState, useRef, useEffect, useMemo } from 'react';
import './EditableText.css';

type EditableTextProps = React.HTMLAttributes<HTMLDivElement> & {
    text: string;
    dataSetter: (value: string) => void;
    extraTextRender?: (value: string) => string;
    filter?: (value: string) => string;
    ignoreEnter?: boolean;
    fullWidth?: boolean
};

const EditableText: React.FC<EditableTextProps> = ({ text, filter, dataSetter, extraTextRender, ignoreEnter, fullWidth, ...props }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);
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
        setIsEditing(false);
        const finalText = filter
            ? filter(textareaRef.current?.innerText || '')
            : textareaRef.current?.innerText || ''

        dataSetter(finalText)
        setEditedText(finalText)
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((!ignoreEnter && event.key === 'Enter') || event.key === 'Escape') {
                textareaRef.current?.blur()
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
    }, [ignoreEnter, isEditing])

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
                <span ref={spanRef} onClick={() => setIsEditing(true)} className={props.className}>{finalText}</span>
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