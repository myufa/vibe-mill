import React, { FC, useEffect, useRef, useState } from "react"
import './TextForm.scss'

export const TextForm: FC<{
    submitText: Function
    placeHoler?: string
}> = (props) => {
    const [ text, updateText ] = useState('')
    return (
        <form 
            className='TextForm'
            onSubmit={(e) => {e.preventDefault; props.submitText(text)}}
        >
            <input 
                type='text' 
                value={text}
                placeholder={props.placeHoler}
                onChange={e => updateText(e.target.value)}
            />
        </form>
    )
}