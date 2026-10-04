import { useEffect, useState } from "react";
import "./tabContent.css";
import { type User } from "./App";
import { checkPhoneNumber } from "./requests";

interface TabType {
  title: string;
  searchBar: boolean;
  items: ChatType[];
}

export interface ChatType {
  chatId: string;
  name: string;
  textMessage: string;
  timestamp: number;
}

interface TabContentProps {
  tab: TabType | undefined;
  setCurrentChat: (chat: ChatType) => void;
  addNewChat: (chat: ChatType) => void;
  user: User;
}

function TabContent({ tab, setCurrentChat, user, addNewChat: addNewChatFunction}: TabContentProps) {
  const [filteredTabs, setFilteredTabs] = useState(tab?.items || []);
  const [addChatVisible, setAddChatVisible] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const filterTab = (value: string) => {
    if (tab && value) {
      setFilteredTabs(tab.items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase())));
    } else {
      setFilteredTabs(tab?.items || []);
    }
  };
  useEffect(() => {
    setFilteredTabs(tab?.items || []);
  }, [tab?.items]);
  const addNewChat = async () => {
    await checkPhoneNumber(newChatName, user.idInstance, user.apiTokenInstance).then((data) => {
      if (data && data.exist) {
        const newChat = {
          chatId: data.chatId,
          name: newChatName || "",
          textMessage: "",
          timestamp: 0
        }
        setFilteredTabs([...filteredTabs, newChat]);
        addNewChatFunction(newChat);
      } else {
        alert("Не удалось создать чат, такой номер телефона не найден");
      }
    });
    setAddChatVisible(false);
    setNewChatName("");
  };

  if (!tab) return null;
  return (
    <article className="tab-content">
      <h2 className="tab-content-title"><span>{tab.title}</span><span onClick={() => setAddChatVisible(!addChatVisible)} className="tab-content-add-button">+</span></h2>
      {tab.searchBar && (
        <input
          onChange={(e) => filterTab(e.target.value)}
          className="search-bar"
          name="search"
          type="text"
          placeholder="Search"
        />
      )}
      {filteredTabs.map((item: ChatType) => (
        <div className="chat-item" key={item.chatId} onClick={() => setCurrentChat(item)}>
          <h4 className="chat-item-name">{item.name}</h4>
        </div>
      ))}
      <div className={`chat-item-add-container ${addChatVisible ? "chat-item-add-container-visible" : ""}`}>
        Создать новый чат:
        <input onChange={(e) => setNewChatName(e.target.value)} value={newChatName} className="chat-item-add-input" type="text" placeholder="Номер телефона" />
        <div className="chat-item-add-button-container">
        <button onClick={addNewChat} className="chat-item-add-button">Создать</button>
        <button onClick={() => { setAddChatVisible(false); setNewChatName(""); }} className="chat-item-add-button">Отмена</button>
        </div>
      </div>
    </article>
  );
}

export default TabContent;
