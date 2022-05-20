import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const { useState, useEffect } = React;

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector(".submitBtn").click();
    }
  });
});

function sendQuery(userInput, callback) {
  const data = {
    prompt: userInput,
    temperature: 0.8,
    max_tokens: 32,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  fetch("https://api.openai.com/v1/engines/text-ada-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.secret}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.choices[0].text);
      callback(data.choices[0].text);
    });
  // callback("Hello!");
}

class Message {
  constructor(text, color) {
    this.text = text;
    this.color = color;
  }
}

function TextBubble(props) {
  return (
    <div className="textBubble" id={props.color}>
      {props.value}
    </div>
  );
}

function App() {
  const [TextBubbles, addTextBubble] = useState([]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  return (
    <div className="app">
      <div id="header">
        <img src="robot.png" id="robotImg" />
        <h2>Ada</h2>
      </div>

      <div className="messageList">
        {TextBubbles.map((Message) => (
          <TextBubble value={Message.text} color={Message.color} />
        ))}
      </div>
      <div className="messageBar">
        <input
          type="text"
          id="userInput"
          onClick={(e) => {
            e.preventDefault();
          }}
        ></input>
        <button
          className="submitBtn"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            var userInput = document.querySelector("#userInput").value;
            document.querySelector("#userInput").value = "";
            addTextBubble((TextBubbles) => [
              ...TextBubbles,
              new Message(userInput, "blue"),
            ]);

            var value = sendQuery(userInput, function (userInput) {
              addTextBubble((TextBubbles) => [
                ...TextBubbles,
                new Message(userInput, "gray"),
              ]);
            });
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    ></meta>
    <App />
  </>
);
