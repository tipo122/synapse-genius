import React, { useState, useEffect } from "react";
import { FabricJSEditor } from "@hooks/useFabricJSEditor";
import { Button, Input, Select } from "antd";
import { TEXT } from "../../types/defaultShapes";

export const FontFamilyList =[
    { value: 'Arial', label: 'Arial' }, 
    { value: 'Impact', label: 'Impact' }, 
    { value: 'serif', label: 'serif' }, 
    { value: 'fantasy', label: 'fantasy' }
];

type textStyleProps = {
    editor: FabricJSEditor
}

export default function TextStyle({
    editor
}: textStyleProps){

    const fontFamilyList = FontFamilyList;
    const handleFontChange = (fontFamily) => {
        editor?.changeTextFont(fontFamily)
    }
    
    const [textSize, setTextSize] = useState(TEXT.fontSize);
    useEffect(() => {
        editor?.changeTextSize(textSize)
    }, [textSize])

    const [isBold, setIsBold] = useState(true);
    const onChangeBoldFont = () => {
        editor?.changeBoldFont(isBold)
        setIsBold(!isBold)
    }

    const [isItalic, setIsItalic] = useState(true);
    const onChangeItalicFont = () => {
        editor?.changeItalicFont(isItalic)
        setIsItalic(!isItalic)
    }

    const [isUnderLine, setIsUnderLine] = useState(true);
    const onChangeUnderLineFont = () => {
        editor?.changeUnderLineFont(isUnderLine)
        setIsUnderLine(!isUnderLine)
    }

    const [isStrikethrough, setIsStrikethrough] = useState(true);
    const onChangeStrikethroughFont = () => {
        editor?.changeStrikethroughFont(isStrikethrough)
        setIsStrikethrough(!isStrikethrough)
    }

    return (
        <>
            <Select defaultValue={fontFamilyList[0]}
                style={{ width: 120 }}
                onChange={handleFontChange}
                options={fontFamilyList}>
            </Select>
            <div>
                <Button onClick={()=>{setTextSize(textSize - 1)}}>-</Button>
                <Input style={{ width: 50 }} value={textSize} onChange={(e)=>setTextSize(Number(e.target.value))}></Input>
                <Button onClick={()=>{setTextSize(textSize + 1)}}>+</Button>
            </div>
            <Button onClick={onChangeBoldFont}>bold</Button>
            <Button onClick={onChangeItalicFont}>Italic</Button>
            <Button onClick={onChangeUnderLineFont}>Under Line</Button>
            <Button onClick={onChangeStrikethroughFont}>strikethrough</Button>
        </>
    )
}