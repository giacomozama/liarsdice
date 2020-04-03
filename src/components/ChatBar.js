import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

class ChatBar extends Component {
    constructor(props) {
        super(props);

        this.playerName = "Jack"

        this.state = {
            chatInputValue: '',
            chatHistory: []
        };

        this.updateChatInputValue = this.updateChatInputValue.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.renderChatHistory = this.renderChatHistory.bind(this);
        this.chatMessage = this.chatMessage.bind(this);
    }

    componentDidUpdate() {
        document.getElementsByClassName('chat-message-list')[0].scrollIntoView(false);
    }

    updateChatInputValue(evt) {
        this.setState({
            chatInputValue: evt.target.value
        });
    }

    renderChatHistory() {
        return this.state.chatHistory.map((msg) => this.chatMessage(msg.name, msg.message))
    }

    sendChatMessage(evt) {
        if (this.state.chatInputValue.trim() === "") return

        this.setState({chatHistory: [...this.state.chatHistory, {name: this.playerName, message: this.state.chatInputValue}],
        chatInputValue: ''})
    }

    render () {

        return(
            <div id="chatBar" className="chat-bar hidden">
                <div className="chat-history">
                    <ul className="chat-message-list">
                        { this.renderChatHistory() }
                    </ul>
                </div>
                
                <div ref="chatMessageInput" className="chat-input">
                    <input type="text" value={this.state.chatInputValue} onChange={this.updateChatInputValue}></input>
                    <button className="btn" onClick={this.sendChatMessage}>Send</button>
                </div>
                <button onClick={() => this.toggleChatBar()} className="standard-button toggle-chat-button"><FontAwesomeIcon icon={faCommentAlt} /></button>
            </div>
        )
        
    }

    chatMessage(name, message) {
        return (
          <li className="chat-message">
            <span className="chat-message-name">{name}: </span>
            <span className="chat-message-text">{message}</span>
          </li>
        )
      }

    toggleChatBar() {
        let bar = document.getElementById("chatBar");
        if (bar.classList.contains("hidden")) {
          bar.classList.remove("hidden")
        } else {
          bar.classList.add("hidden")
        }
    }
}

export default ChatBar;