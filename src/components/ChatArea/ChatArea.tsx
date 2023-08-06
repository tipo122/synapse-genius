import React, { useState } from "react";
import { Input, Button } from "antd";
import { useChatCompletion } from "../../hooks/useChatCompletion";
import "./ChatArea.css";

interface ChatProps {
  children?: React.ReactElement;
}
const { TextArea } = Input;
// const functions = getFunctions();

const Chat = (props: ChatProps) => {
  // const [messages, setMessages] = useState<any>([]);
  const { messages, submitPrompt } = useChatCompletion({
    model: "gpt-4",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY
      ? process.env.REACT_APP_OPENAI_API_KEY
      : "",
    temperature: 0.9,
  });
  const [prompt, setPrompt] = useState<string>("");
  const handleClick = async () => {
    // submitPrompt([{ content: prompt, role: 'user' }]);
    await submitPrompt({ content: prompt, role: "user" });
    // setMessages([result]);
    setPrompt("");
  };

  return (
    <div className="chat-body-div">
      {messages.length < 1 ? (
        <div className="empty">No messages</div>
      ) : (
        messages.map((msg, i) => <div>{msg.content}</div>)
      )}
      <div className="chat-textarea-div">
        <TextArea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <Button onClick={handleClick} className="chat-button">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Chat;
