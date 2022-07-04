import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";
import { useSearchParams, useParams, useLocation } from "react-router-dom";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../../components/Input/Input";
import Messages from "../Messages/Messages";

let socket;

function Chat({ location }) {
  // let [params] = useSearchParams();
  let search = useLocation().search;
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    //const { name, room } = queryString.parse();
    const name = new URLSearchParams(search).get("name");
    const room = new URLSearchParams(search).get("room");
    //  console.log(location, name);
    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);

    socket.emit("join", { name, room });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  //func for sending messages

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;
