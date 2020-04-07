import React from 'react'
import './App.css'
import ChatBar from "./components/ChatBar"
import PlayerTurnPanel from "./components/PlayerTurnPanel"
import Dimmer from './components/Dimmer'
import PlayerInputPanel from './components/PlayerInputPanel'
import GameEventList from './components/GameEventList'
import MenuScreen from './components/MenuScreen'
import GameController from './components/GameController'
import GameInfoControlPanel from './components/GameInfoControlPanel'

export default class LiarsDice extends React.Component {

  constructor(props) {
    super(props);

    this.playerName = "PLAYER"

    this.state = {
      inGame: false,
      currentPanelFading: false,
      usernames: [],
      urlRoomCode: ""
    }

    this.dimmerRef = React.createRef(this.refs.dimmer)
    this.playerInputPanelRef = React.createRef(this.refs.playerInputPanel)
    this.menuScreenRef = React.createRef(this.menuScreenRef)
    this.audioRef = React.createRef(this.refs.audioRef)

    this.gameController = new GameController(process.env.REACT_APP_BACKEND || 'http://localhost:8080')
    this.gameController.app = this;
  }

  componentDidMount() {
    const urlR = this.getUrlVars()["r"]
    this.setState({urlRoomCode: (urlR !== undefined) ? urlR : "" })
  }

  getUrlVars() {
    const vars = {}
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => vars[key] = value)
    return vars
  }

  switchInGame() {
    if (!this.state.currentPanelFading) {
        this.setState({ currentPanelFading: true })
        setTimeout(() => {
            this.setState({
                inGame: !this.state.inGame,
                currentPanelFading: false 
            })
        }, 500)
    }
  }

  render () {
    const playerTurnPanels = []
    this.state.usernames.forEach((u, i) => playerTurnPanels.push(<PlayerTurnPanel key={"ptp" + i} playerName={u} panelColor={i} />))

    return (
      (this.state.inGame) ?
        <div className="App">
          <audio loop ref={this.audioRef} onPlay={() => this.audioRef.current.volume='0.5'} src={'/liarsdice/res/perudo.mp3'} autoPlay/>
          <Dimmer ref={this.dimmerRef}/>
          <div className="App-body">
            <PlayerInputPanel ref={this.playerInputPanelRef} dimmerRef={this.dimmerRef}></PlayerInputPanel>
            <div className={`main-content ${this.state.currentPanelFading ? "concealed" : ""}`}>
              <div className="left-container">
                <GameEventList></GameEventList>
                <GameInfoControlPanel audioRef={this.audioRef}></GameInfoControlPanel>
              </div>
              <div className="center-container">
                {playerTurnPanels}
              </div>
              <div className="right-container">
                <ChatBar app={this} gameController={this.gameController} showInputDialogFunction={() => {this.dimmerRef.current.dim(); this.playerInputPanelRef.current.show()}} id="chat-bar"/>
              </div>
            </div>
          </div>
        </div> :
        <div className="App">
          <div className="App-body">
            <MenuScreen ref={this.menuScreenRef} gameController={this.gameController} app={this}></MenuScreen>
          </div>
        </div>
    )
  }
}