import axios, {AxiosResponse} from 'axios';
import React, {useEffect, useState} from 'react'
import { IoMdSend } from "react-icons/io";
import  "./LlmStyle.css"

export const ChatbotUI = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");

    const sendMessage = async () => {
        if (value.trim() === "") return; // Prevent sending empty messages

        const newMsg = { role: "user", content: value };
        setMessages([...messages, newMsg]);

        try {
            const payload = {
                "model": "llama3.2:latest",
                "messages": [
                    { "role": "user", "content": value }
                ],
                "stream": false
            };

            const response = await axios.post('http://localhost:11434/api/chat', payload);
            if (response.status === 200) {
                setMessages(prev => [...prev, response.data.message]);
                setValue("");
            } else {
                console.error(`Unexpected status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <>
            <div className='chat-box'>
                <div className="chat-innerbox">
                    <div className="messages">
                        {
                            messages?.map((msg, index) => (
                                <div key={index} className={msg.role}>{msg.content}</div>
                            ))
                        }
                    </div>
                    <div className='input-box'>
                        <input
                            type="text"
                            className='input-control'
                            placeholder='Type Something'
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        ></input>
                        <div className='send' onClick={sendMessage}><IoMdSend /></div>
                    </div>
                </div>
            </div>
        </>
    );
};

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


    const extractScores = (text: string): { [key: string]: number } => {
        const pattern = /(\d+\.\s+[^:]+):\s+(\d+\/10|No score can be provided for this requirement as no description was given\.)/g;
        let matches: RegExpExecArray | null;

        // Create a dictionary to store the results
        const scores: { [key: string]: number } = {};

        while ((matches = pattern.exec(text)) !== null) {
            const characteristic = matches[1].trim();
            const scoreText = matches[2];

            // Extract the numerator if it exists, otherwise assign 0
            const score = (/\d+\/10/.test(scoreText)) ? parseInt(scoreText.split('/')[0], 10) : 0;
            scores[characteristic] = score;
        }
        console.log(scores)
        return scores;
    };



    // useEffect(() => {
    //     setResponse(res.data.message.role , res.data.message.content);
    // }, [res]);

    try {
        // const [response, setResponse] = useState<AxiosResponse>();

        const res = await axios.post('http://127.0.0.1:11434/api/chat', payload);
        // Optionally, you can handle the response here if needed

        // setResponse (res);


        if (res.status === 200) {
            setResponse(res.data.message.role , res.data.message.content);

            // setValue("");
            console.log('Response:', res.data.message);

            console.log( extractScores(res.data.message.content));

        } else {
            console.error(`Unexpected status code: ${res.status}`);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred while fetching the response.');
    }
};


export default ChatbotUI;