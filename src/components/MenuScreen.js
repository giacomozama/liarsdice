import React from 'react'
import logo from '../logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faExclamationTriangle, faClipboard, faLink } from '@fortawesome/free-solid-svg-icons'
import PlayerList from './PlayerList'

class MenuScreen extends React.Component {
    constructor(props) {
        super(props)

        this.playerListRef = React.createRef(this.refs.playerListRef)
        this.joinErrorLblRef = React.createRef(this.refs.joinErrorLblRef)
        this.username = ""
        this.roomCode = ""

        this.state = {
            currentPanel: 0,
            currentPanelFading: false,
            canPlay: false,
            canJoin: this.roomCode.length !== 6,
            canStart: false,
            connected: false,
            gameOwner: false,
            joinError: ""
        }

        this.errorMessage = ""
    }

    switchPanel(panel) {
        if (!this.state.currentPanelFading) {
            this.setState({ currentPanelFading: true })
            setTimeout(() => {
                this.setState({
                    joinError: "",
                    currentPanel: panel,
                    currentPanelFading: false 
                })
            }, 500)
        }
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
                            <button className="btn" disabled={!this.state.canPlay || !this.state.connected} onClick={() => { 
                                if (this.props.app.state.urlRoomCode === "")
                                    this.switchPanel(1)
                                else {
                                    this.roomCode = this.props.app.state.urlRoomCode
                                    this.props.app.gameController.joinRoom(this.username, this.roomCode, () => { 
                                            this.setState({ gameOwner: false })
                                            this.switchPanel(2)
                                    })}
                                }}>{this.props.app.state.urlRoomCode === "" ? "Join a room" : <span>Join room <span className='url-room-code'>{this.props.app.state.urlRoomCode}</span></span>}</button>
                            <button className="btn" disabled={!this.state.canPlay || !this.state.connected} onClick={() => {
                                this.props.app.gameController.createRoom(this.username, (roomCode) => {
                                    this.setState({ gameOwner: true })
                                    this.roomCode = roomCode
                                    this.switchPanel(2)
                                })
                            }}>Create a room</button>
                            <button className="btn" onClick={() => this.switchPanel(3)}>About</button>
                        </div>
                    </div>)
                break
            case 1:
                content = (
                    <div className={`main-menu-panel room-code-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => { this.switchPanel(0) }}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;GO BACK</button>
                        <div ref={this.joinErrorLblRef} className={"join-error "+(this.state.joinError !== "" ? "" : "hidden")}>{this.state.joinError}</div>
                        <input type="text" placeholder="Room code" maxLength='6' value={this.roomCode} onChange={(e) => {
                                if (e.target.value.trim().length !== 6) 
                                    this.setState({canJoin: false})
                                else 
                                    this.setState({canJoin: true})
                                    
                                this.roomCode=e.target.value.trim()}}></input>
                        <button className="btn-claim btn-joinroom btn" disabled={!this.state.canJoin} onClick={() => {
                                    this.setState({ gameOwner: false })
                                    this.props.app.gameController.joinRoom(this.username, this.roomCode, () => this.switchPanel(2))
                                }}>JOIN ROOM</button>
                    </div>
                )
                break
            case 2:
                content = (
                    <div className={`main-menu-panel room-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => { this.props.app.gameController.leaveRoom(); this.props.app.setState({urlRoomCode: ""}); this.switchPanel(0) }}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;LEAVE ROOM</button>
                        <div className="room-code-box">
                            <span className="room-code-hint">ROOM CODE:</span>
                            <div className="room-code-link-box">
                                <span className="room-code-label">{this.roomCode}</span>
                                <div className="room-code-btns">
                                    <div className="room-code-copy-code" onClick={() => navigator.clipboard.writeText(this.roomCode)}>
                                        <FontAwesomeIcon icon={faClipboard}></FontAwesomeIcon>
                                    </div>
                                    <div className="room-code-copy-link"onClick={() => navigator.clipboard.writeText(`${window.location.protocol + '//' + window.location.host + window.location.pathname}?r=${this.roomCode}`)}>
                                        <FontAwesomeIcon icon={faLink}></FontAwesomeIcon>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PlayerList ref={this.playerListRef} usernames={this.props.app.state.usernames}></PlayerList>
                        <button className="btn-claim btn-joinroom btn" disabled={!this.state.gameOwner || !this.state.canStart} onClick={() => this.props.app.switchInGame()}>START GAME</button>
                    </div>
                )
                break
            case 3:
                content = (
                    <div className={`main-menu-panel about-panel ${this.state.currentPanelFading ? "concealed" : ""}`}>
                        <button className="btn-doubt btn" onClick={() => this.switchPanel(0)}><FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>&nbsp;&nbsp;&nbsp;GO BACK</button>
                        <div className="about-text">
                            <span>
                            Made by Giacomo Zama and Alessandro Fusco.<br />Music by Filippo Adessi.<br /><br/><a target='blank' href="https://github.com/giacomozama/liarsdice">Client GitHub Repo</a><br /><a target='blank' href="https://github.com/giacomozama/liarsdice-server">Server GitHub Repo</a><br/><br/>Built with ReactJS, NodeJS,&nbsp;Socket.io and&nbsp;FontAwesome.
                            </span>
                        </div>
                    </div>
                )
                break
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
                break
            default:
                content = null
                break
        }

        return (
            <div className={`main-menu-container ${this.props.app.state.currentPanelFading ? "concealed" : ""}`}>
                {content}
            </div>
        )
    }
}

export default MenuScreen

//dice = [[1,5,3,2,5,6],[1,5,3,4,5,6],[4,5,1,2,5,4]]
const testDoubt = (amount, pips, dice) => (dice.reduce((acc, d) => acc + d.filter(dd => dd === pips).length, 0) >= amount)