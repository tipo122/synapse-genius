import { useState } from "react";
// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { ChatCompletionRequestMessage } from "openai";
import { functions } from "../firebase";
import { httpsCallable } from "firebase/functions";

interface UseChatCompletionProps {
  model: string;
  apiKey: string;
  temperature: number;
}

export const useChatCompletion = ({
  model,
  temperature,
}: UseChatCompletionProps) => {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const submitPrompt = async (msg: ChatCompletionRequestMessage) => {
    msg && setMessages([...messages, msg]);

    const onCreateChatCompletion: (data: any) => Promise<{
      data: { choices: [{ message: ChatCompletionRequestMessage }] };
    }> = httpsCallable(functions, "oncreatechatcompletion");
    try {
      const res = await onCreateChatCompletion({
        model: model,
        messages: [msg],
        temperature: temperature,
      });

      res.data.choices[0].message &&
        setMessages([...messages, msg, res.data.choices[0].message]);
    } catch (e) {
      setMessages([
        ...messages,
        { content: "エラーが発生しました", role: "system" },
      ]);
    }
  };

  return { messages, submitPrompt };
};
