import { onSnapshot, doc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContext";

const Chats = () => {

    const [chats, setChats] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => { 
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
            setChats(doc.data())
        });

        return () => {
            unsub();
        }
    }

    currentUser.uid && getChats()
    },[currentUser.uid])

    const handleSelect = (user) => {
      dispatch({type:"CHANGE_USER", payload: user})
    }

    console.log(chats);
    return (
            <div>
            {Object.entries(chats)?.map(chat=>(
                <div
            key={chat[0]}
            className="flex items-center p-4 hover:bg-gray-800 hover:bg-opacity-30 cursor-pointer transition-colors"
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-4"/>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{chat[1].userInfo.displayName}</h3>
              <p className="text-sm text-gray-400 truncate">{chat[1].userInfo.lastMessage?.text}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{4}</p>
              {/* {chat.unread > 0 && (
                <span className="bg-gray-600 text-white text-xs rounded-full px-2 py-1 mt-1 inline-block">
                  {chat.unread}
                </span>
              )} */}
            </div>
          </div>
            ))}
            </div>
    )
}

export default Chats;