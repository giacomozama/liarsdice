import React from 'react'
import logo from '../logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import PlayerList from './PlayerList'

class MenuScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            currentPanel: 0,
            currentPanelFading: false,
            canPlay: false,
            canJoin: false,
            canStart: true,
            connected: false
        }

        this.gameOwner = false
        this.playerListRef = React.createRef(this.refs.playerListRef)
        this.gameController = this.props.gameController
        this.username = ""
        this.roomCode = ""
        this.errorMessage = ""
    }

    switchPanel(panel) {
        if (!this.state.currentPanelFading) {
            this.setState({ currentPanelFading: true })
            setTimeout(() => {
                this.setState({
                    currentPanel: panel,
                    currentPanelFading: false 
                })
            }, 500)
        }
    }

    componentDidMount() {
        this.gameController.playerListUpdateFunction = (usernames) => {
            this.playerListRef.current.setState({playerList: usernames})
        }
        this.gameController.setConnectedFunction = (isConnected) => this.setState({'connected': isConnected})
    }

    componentDidUpdate() {
        if (this.state.canPlay && this.username.length < 5) this.setState({canPlay: false})
        if (!this.state.canPlay && this.username.length >= 5) this.setState({canPlay: true})
    }

    showError(errorMessage) {
        this.errorMessage = errorMessage
        this.switchPanel(4)
    }

    render () {
        let content
        switch(this.state.currentPanel) {
            case 0:
                content = (
                    <div className={`main-menu-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <img className="logo" src={logo} alt="Logo"></img>
                        <div className={`server-status ${this.state.connected ? 'connected' : 'disconnected'}`}>{this.state.connected ? 'CONNECTED TO SERVER' : 'DISCONNECTED'}</div>
                        <input type="text" placeholder="Insert your username here" maxLength='20' value={this.username} onChange={(e) => {
                                if (e.target.value.trim().length < 5) 
                                    this.setState({canPlay: false})
                                else 
                                    this.setState({canPlay: true})
                                    
                                this.username=e.target.value.trim()}}></input>
                        <div className="menu-btns-container">
                            <button className="btn" disabled={!this.state.canPlay || !this.state.connected} onClick={() => this.switchPanel(1)}>Join a room</button>
                            <button className="btn" disabled={!this.state.canPlay || !this.state.connected} onClick={() => {
                                this.gameController.createRoom(this.username, (roomCode) => {
                                    this.gameOwner = true
                                    this.roomCode = roomCode
                                    this.switchPanel(2)
                                })
                            }}>Create a room</button>
                            <button className="btn" onClick={() => this.switchPanel(3)}>About</button>
                        </div>
                    </div>)
                break;
            case 1:
                content = (
                    <div className={`main-menu-panel room-code-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => this.switchPanel(0)}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;GO BACK</button>
                        <input type="text" placeholder="Room code" maxLength='6' value={this.roomCode} onChange={(e) => {
                                if (e.target.value.trim().length !== 6) 
                                    this.setState({canJoin: false})
                                else 
                                    this.setState({canJoin: true})
                                    
                                this.roomCode=e.target.value.trim()}}></input>
                        <button className="btn-claim btn-joinroom btn" disabled={!this.state.canJoin} onClick={() => {
                                    this.gameOwner = false
                                    this.gameController.joinRoom(this.username, this.roomCode, () => this.switchPanel(2))
                                }}>JOIN ROOM</button>
                    </div>
                )
                break;
            case 2:
                content = (
                    <div className={`main-menu-panel room-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => this.switchPanel(0)}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;LEAVE ROOM</button>
                        <div className="room-code-box">
                            <span className="room-code-hint">ROOM CODE:</span>
                            <span className="room-code-label">{this.roomCode}</span>
                        </div>
                        <PlayerList ref={this.playerListRef} usernames={this.gameController.usernames}></PlayerList>
                        <button className="btn-claim btn-joinroom btn" disabled={!this.gameOwner} onClick={() => this.props.app.switchInGame()}>START GAME</button>
                    </div>
                )
                break;
            case 3:
                content = (
                    <div className={`main-menu-panel about-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => this.switchPanel(0)}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;GO BACK</button>
                        <div className="about-text">
                            <span>
                            Made by Giacomo Zama and Alessandro Fusco.<br />Music by Filippo Adessi.<br /><br/><a href="https://github.com/giacomozama/liarsdice">Client GitHub Repo</a><br /><a href="https://github.com/giacomozama/liarsdice-server">Server GitHub Repo</a><br/><br/>Built with ReactJS, NodeJS, Socket.io and&nbsp;FontAwesome.
                            </span>
                        </div>
                    </div>
                )
                break;
            case 4:
                content = (
                    <div className={`main-menu-panel error-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className="error-symbol"></FontAwesomeIcon>
                        <div className="error-text">
                            {this.errorMessage}<br/><br/>
                            Please reload the page.
                        </div>
                    </div>
                )
                break;
            default:
                content = null
                break;
        }

        return (
            <div className={`main-menu-container ${this.props.app.state.currentPanelFading ? "concealed" : ""}`}>
                {content}
            </div>
        )
    }
}

export default MenuScreen