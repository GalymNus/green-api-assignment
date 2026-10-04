import { apiUrl } from "./consts";

export const getChats = async (idInstance: string, apiTokenInstance: string) => {
    try {
        const response = await fetch(`${apiUrl}/waInstance${idInstance}/getChats/${apiTokenInstance}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
export const sendMessage = async (idInstance: string, apiTokenInstance: string, message: string) => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    });
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getChatHistory = async (idInstance: string, apiTokenInstance: string, chatId: string) => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
    });
    const data = await response.json();
      return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};


export const sendChatMessage = async (idInstance: string, apiTokenInstance: string, chatId: string, message: string): Promise<Boolean> => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId, message }),
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) { 
    console.error(error);
    return false;
  }
}; 

export const checkPhoneNumber = async (phoneNumber: string, idInstance: string, apiTokenInstance: string) => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: Number(phoneNumber) }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const receiveNotification = async (idInstance: string, apiTokenInstance: string) => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, {
      method: "GET",
    });
    const data = await response.json();
    if (!data) {
      return false;
    }
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteNotification = async (idInstance: string, apiTokenInstance: string, receiptId: string) => {
  try {
    const response = await fetch(`${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(error);
    return false;
  }
};