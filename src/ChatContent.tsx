import { useEffect, useState } from "react";
import { type ChatType } from "./tabContent";
import { type User } from "./App";
import { getChatHistory, sendChatMessage, receiveNotification, deleteNotification } from "./requests";
import "./ChatContent.css";

type ChatMessageType = ChatType & {
    idMessage: string;
    type: string;
    senderName: string;
}

function ChatContent({ chat, user }: { chat: ChatType | null, user: User }) {
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");
    useEffect(() => {
        if (chat && user?.idInstance && user?.apiTokenInstance) {
        getChatHistory(user?.idInstance, user?.apiTokenInstance, chat.chatId).then((chatHistory: ChatMessageType[]) => {
            setChatHistory(chatHistory);
            scrollToBottom();
          });
        }
    }, [chat?.chatId]);
    useEffect(() => {
        if (!user?.idInstance || !user?.apiTokenInstance) return;
        let ignore = false;
        const poll = async () => {
            while (!ignore) {
                const notification = await receiveNotification(user.idInstance, user.apiTokenInstance);
                if (ignore || !notification) continue;
                const body = notification.body;
                const isText =
                body.typeWebhook === "incomingMessageReceived" &&
                body.messageData.typeMessage === "textMessage" &&
                body.senderData.chatId === chat?.chatId;
                if (isText) {
                    const newMessage = {
                        chatId: body.senderData.chatId,
                        name: body.senderData.chatName,
                        idMessage: body.idMessage,
                        type: "incoming",
                        senderName: body.senderData.senderName,
                        textMessage: body.messageData.textMessageData.textMessage,
                        timestamp: body.timestamp
                    }
                    setChatHistory((prev) => [newMessage as ChatMessageType, ...prev]);
                    scrollToBottom();
            }
            await deleteNotification(user.idInstance, user.apiTokenInstance, notification.receiptId);
        }
        };
        poll(); 
        return () => {
          ignore = true;
        };
    }, [chat?.chatId, user?.idInstance, user?.apiTokenInstance]);
    const scrollToBottom = () => {
        const chatContent = document.querySelector(".chat-content");
        if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    }
    const sendMessage = async () => {
        if (user?.idInstance && user?.apiTokenInstance && chat?.chatId && chatMessage) {
            const sent = await sendChatMessage(user?.idInstance, user?.apiTokenInstance, chat?.chatId, chatMessage);
            const timestamp = Math.floor(Date.now() / 1000);
            if (sent) {
                setChatHistory([{
                    chatId: chat?.chatId,
                    name: chat?.name,
                    idMessage:  timestamp.toString(),
                    type: "outgoing",
                    senderName: "",
                    textMessage: chatMessage,
                    timestamp: timestamp
                }, ...chatHistory]);
                scrollToBottom();
            } else {
                alert("Не удалось отправить сообщение");
            }
            setChatMessage("");
        }
    }

    if (!chat) return <div></div>;
    return (
    <section className="chat-content">{chatHistory.map((item:  ChatMessageType) => 
        <div key={item.idMessage} className={`chat-message chat-message-${item.type}`}>
            {item.senderName ? item.senderName : "Я"}: {item.textMessage} 
            <span className="chat-message-time">
                {new Date(item.timestamp * 1000).toLocaleString()} 
            </span>
        </div>)}
        <div className="chat-message-input-container">
            <input className="chat-message-input" value={chatMessage} type="text" onChange={(e) => setChatMessage(e.target.value)} />
            <button className="chat-message-send-button" onClick={sendMessage}>Отправить</button>
        </div>
    </section>);
}

export default ChatContent;