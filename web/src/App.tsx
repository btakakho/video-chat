import { useState, useEffect } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:4001";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io(ENDPOINT, { path: '/signalling-server/' });

    socket.on("connect", () => {
      console.log('connected', socket.id);
      setResponse(socket.id)
    });
  }, []);

  return (
    <div>
      socketID: {response}
    </div>
  );
}

export { App }