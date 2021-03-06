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
import ErrorScreen from './components/ErrorScreen'

export default class LiarsDice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      inGame: false,
      currentPanelFading: false,
      players: [],
      myGid: -1,
      activePlayerGid: -1,
      urlRoomCode: ""
    }

    this.dimmerRef = React.createRef(this.refs.dimmer)
    this.playerInputPanelRef = React.createRef(this.refs.playerInputPanel)
    this.menuScreenRef = React.createRef(this.menuScreenRef)
    this.audioRef = React.createRef(this.refs.audioRef)
    this.chatBarRef = React.createRef(this.refs.chatBarRef)
    this.errorScreenRef = React.createRef(this.refs.errorScreenRef)
    this.gameEventListRef = React.createRef(this.refs.gameEventListRef)

    this.previousPips = null
    this.playerTurnPanelRefs = {}

    this.gameController = new GameController(process.env.REACT_APP_BACKEND || 'http://localhost:8080')
    this.gameController.app = this;
  }

  findPlayerByGid(gid) {
    return this.state.players.find((p) => p.gid === gid)
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
    return (
      (this.state.inGame) ?
        <div className="App">
          <audio loop ref={this.audioRef} onPlay={() => this.audioRef.current.volume='0.5'} src={'/liarsdice/res/perudo.mp3'} autoPlay/>
          <Dimmer ref={this.dimmerRef}/>
          <div className="App-body">
            <ErrorScreen ref={this.errorScreenRef} dimmerRef={this.dimmerRef}></ErrorScreen>
            <PlayerInputPanel ref={this.playerInputPanelRef} app={this}></PlayerInputPanel>
            <div className={`main-content ${this.state.currentPanelFading ? "concealed" : ""}`}>
              <div className="left-container">
                <GameEventList ref={this.gameEventListRef}></GameEventList>
                <GameInfoControlPanel noOfDice={this.state.players.reduce((acc, p) => acc + p.dice.filter(d => d !== -1).length, 0)} audioRef={this.audioRef}></GameInfoControlPanel>
              </div>
              <div className="center-container">
                {this.state.players.map((p, i) => {
                  this.playerTurnPanelRefs[p.gid] = React.createRef()
                  return (
                    <PlayerTurnPanel 
                      ref={this.playerTurnPanelRefs[p.gid]}
                      isLocalPlayer={p.gid === this.state.myGid}
                      isActivePlayer={p.gid === this.state.activePlayerGid}
                      app={this}
                      key={"ptp" + i}
                      player={p} />)})}
              </div>
              <div className="right-container">
                <ChatBar app={this} ref={this.chatBarRef} gameController={this.gameController} showInputDialogFunction={() => {this.dimmerRef.current.dim(); this.playerInputPanelRef.current.show()}} id="chat-bar"/>
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