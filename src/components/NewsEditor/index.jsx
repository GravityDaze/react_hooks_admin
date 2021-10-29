import React,{ useState } from 'react'
import { EditorState,convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default ({getContent})=> {
    const [editorState,setEditorState] = useState(EditorState.createEmpty())
    return (
        <Editor 
            editorState={editorState}
            onEditorStateChange={ state=>{
                setEditorState(state)
            } }
            onBlur={ 
                ()=> getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
             }
        />
        
    )
}
