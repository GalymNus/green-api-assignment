import { useState, type Dispatch, type SetStateAction, useEffect } from "react";

import "./App.css";
import { getChats } from "./requests";
import { tabs } from "./consts";
import { type ChatType } from "./tabContent";
import ChatContent from "./ChatContent";
import Login from "./login";
import reactLogo from "./assets/react.svg";
import TabContent from "./tabContent";


export interface User {
  idInstance: string;
  apiTokenInstance: string;
}

function App() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [user, setUser]: [User | null, Dispatch<SetStateAction<User | null>>] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState(tabs[0].value);
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);

  const addNewChat = (chat: ChatType) => {
    setChats([...chats, chat]);
    setCurrentChat(chat);
  };
  useEffect(() => {
    if (user?.idInstance && user?.apiTokenInstance && chats.length === 0) {
      getChats(user.idInstance, user.apiTokenInstance).then((chats) => {
        setChats(chats);
      });
    }
  }, [user?.idInstance, user?.apiTokenInstance]);
  if (!user) {
    return <Login onLogin={setUser} />;
  }
  const currentTabContent = tabs.find((tab) => tab.value === currentTab)?.content;

  return (
    <main className="page">
      <aside className="aside">
        <img src={reactLogo} className="react-logo" alt="React logo" />
        {tabs.map((tab, index) => {
          return (
            <button
              tabIndex={index + 1}
              onClick={() => setCurrentTab(tab.value)}
              key={tab.value}
              className={currentTab === tab.value ? "active" : ""}
            >
              <img width={24} height={24} alt="" src={new URL(`./assets/${tab.icon}.svg`, import.meta.url).href} />
              {tab.label}
            </button>
          );
        })}
      </aside>
      <section className="chats">
        {(currentTabContent && <TabContent tab={{...currentTabContent, items: chats}} addNewChat={addNewChat} user={user} setCurrentChat={setCurrentChat} />) || <div>No content</div>}
      </section>
      <section className="chat-content-container">{<ChatContent chat={currentChat} user={user} />}</section>
    </main>
  );
}

export default App;
