import axios from 'axios';
import React, { useState } from 'react'
import { IoMdSend } from "react-icons/io";
import  "./LlmStyle.css"

export const ChatbotUI = () => {

    const [messages,setMessages]=useState([])

    const [value,setValue]=useState("")

    const sendMessage=async()=>{
        const newMsg={role:"user",content:value}
        setMessages([...messages,newMsg])

        const payload={
            "model": "llama3.2:latest",
            "messages": [
                { "role": "user", "content": value }
            ],
            "stream":false
        }

        axios.post('http://127.0.0.1:11434/api/chat',payload).then(res=>{
            console.log(res.data.message)
            setMessages(prev=>[...prev,res.data.message])
            setValue("")
        }).catch(err=>console.log(err))
    }
    return (
        <>
            <div className='chat-box'>
                <div className="chat-innerbox">
                    <div className="messages">
                        {
                            messages?.map((msg,index)=>(
                                <div key={index} className={msg.role}>{msg.content}</div>
                            ))
                        }
                    </div>
                    <div className='input-box'>
                        <input type="text"
                               className='input-control'
                               placeholder='Type Something'
                               value={value}
                               onChange={(e)=>setValue(e.target.value)}></input>
                        <div className='send' onClick={sendMessage}><IoMdSend /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const LlmExtractor = () => {
    const [messages,setMessages]=useState([])
    const [value,setValue]=useState("")


    // const sendPresetMessage=async()=>{
    //     const newMsg={role:"user",content:value}
    //     setMessages([...messages,newMsg])
    //     const payload={
    //         "model": "llama3.2:latest",
    //         "messages": [
    //             { "role": "user", "content": value }
    //         ],
    //         "stream":false
    //     }
    //     axios.post('http://127.0.0.1:11434/api/chat',payload).then(res=>{
    //         console.log(res.data.message)
    //         setMessages(prev=>[...prev,res.data.message])
    //         setValue("")
    //     }).catch(err=>console.log(err))
    // }

    return (
        <>
            <div className='chat-box'>
                <div className="chat-innerbox">
                    <div className="messages">
                        {
                            messages?.map((msg,index)=>(
                                <div key={index} className={msg.role}>{msg.content}</div>
                            ))
                        }
                    </div>
                    {/*<div className='input-box'>*/}
                    {/*    <input type="text"*/}
                    {/*           className='input-control'*/}
                    {/*           placeholder='Type Something'*/}
                    {/*           value={value}*/}
                    {/*           onChange={(e)=>setValue(e.target.value)}></input>*/}
                    {/*    <div className='send' onClick={sendPresetMessageMessage}><IoMdSend /></div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    )
}


export const sendPresetMessage = async (message, setResponse) => {
    const payload = {
        "model": "llama3.2:latest",
        "messages": [
            { "role": "user", "content": message }
        ],
        "stream": false
    };

    try {
        const res = await axios.post('http://127.0.0.1:11434/api/chat', payload);
        // Optionally, you can handle the response here if needed
        setResponse(res.data.message);
        console.log('Response:', res.data.message);
    } catch (err) {
        console.error(err);
        alert('An error occurred while fetching the response.');
    }
};


export default ChatbotUI;