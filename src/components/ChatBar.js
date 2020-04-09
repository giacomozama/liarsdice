import React, { Component } from 'react';
import '../App.css';

class ChatBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatInputValue: '',
            chatHistory: []
        };

        this.updateChatInputValue = this.updateChatInputValue.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
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

    sendChatMessage() {
        if (this.state.chatInputValue.trim() === "") return
        if (this.state.chatInputValue.trim() === "/claimdialog")
            this.props.app.playerInputPanelRef.current.showInputDialog(5, 6, "TEST PLAYER")
        if (this.state.chatInputValue.trim() === "/roll")
            this.props.app.localPlayerPanelRef.current.rollAllDice(
                this.props.app.state.players.find(p => p.gid == this.props.app.state.myGid).dice
            )

        this.setState({ chatInputValue: "" })

        this.props.app.gameController.sendChatMessage(this.state.chatInputValue)
    }

    render () {
        return(
            <div id="chatBar" className="chat-bar">
                <div className="chat-history">
                    <ul className="chat-message-list">
                        {this.state.chatHistory.map((msg, i) => this.chatMessage(msg.player, msg.message, i))}
                    </ul>
                </div>
                
                <div ref="chatMessageInput" className="chat-input">
                    <input type="text" onKeyDown={(e) => {if (e.keyCode === 13) {this.sendChatMessage()}}} value={this.state.chatInputValue} maxLength={100} onChange={this.updateChatInputValue}></input>
                    <button className="btn" onClick={this.sendChatMessage}>Send</button>
                </div>
                {/* <button onClick={() => this.toggleChatBar()} className="standard-button toggle-chat-button"><FontAwesomeIcon icon={faCommentAlt} /></button> */}
            </div>
        )
    }

    chatMessage(player, message, i) {
        return (
          <li key={`cm${i}`} className={`chat-message ${(player.gid === this.props.app.state.myGid) ? "local-player" : ""}`}>
            <span pid={player.gid} className="chat-message-name">{player.username}</span>
            <span className="chat-message-text">{message}</span>
          </li>
        )
    }
}

export default ChatBar;