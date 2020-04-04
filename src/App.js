import React from 'react'
import './App.css'
import ChatBar from "./components/ChatBar"
import PlayerTurnPanel from "./components/PlayerTurnPanel"
import Dimmer from './components/Dimmer'
import PlayerInputPanel from './components/PlayerInputPanel'
import GameEventList from './components/GameEventList'
import MenuScreen from './components/MenuScreen'
import GameController from './components/GameController'

export default class LiarsDice extends React.Component {

  constructor(props) {
    super(props);

    this.playerName = "Jack"

    this.state = {
      inGame: false,
      currentPanelFading: false,
    }

    this.dimmerRef = React.createRef(this.refs.dimmer)
    this.dimmer = <Dimmer ref={this.dimmerRef}/>
    this.playerInputPanelRef = React.createRef(this.refs.playerInputPanel)
    this.playerInputPanel = <PlayerInputPanel ref={this.playerInputPanelRef} undimFunction={() => this.dimmerRef.current.undim()}></PlayerInputPanel>
    
    this.gameController = new GameController('localhost', '8080', (errorMessage) => console.log(errorMessage) )
    this.menuScreen = <MenuScreen ref={this.menuScreenRef} gameController={this.gameController} app={this}></MenuScreen>

    this.menuScreenRef = React.createRef(this.menuScreenRef)
    this.audioRef = React.createRef(this.refs.audioRef)
  }

  componentDidMount() {
    this.gameController.errorFunction = (errorMessage) => this.menuScreenRef.current.showError(errorMessage)
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
    this.gameController.usernames.forEach((u, i) => playerTurnPanels.push(<PlayerTurnPanel playerName={u} panelColor={i} />))

    return (
      (this.state.inGame) ?
        <div className="App">
          <audio loop ref={this.audioRef} onPlay={() => this.audioRef.current.volume='0.2'} src={'/liarsdice/res/perudo.mp3'} autoPlay/>
          {this.dimmer}
          <div className="App-body">
            {this.playerInputPanel}
            <div className={`main-content ${this.state.currentPanelFading ? "concealed" : ""}`}>
              <div className="left-container">
                <GameEventList></GameEventList>
              </div>
              <div className="center-container">
                {playerTurnPanels}
              </div>
              <div className="right-container">
                <ChatBar showInputDialogFunction={() => {this.dimmerRef.current.dim(); this.playerInputPanelRef.current.show()}} id="chat-bar"/>
              </div>
            </div>
          </div>
        </div> :
        <div className="App">
          <div className="App-body">
            {this.menuScreen}
          </div>
        </div>
    )
  }
}