import React from 'react'
import './App.css'
import ChatBar from "./components/ChatBar"
import PlayerTurnPanel from "./components/PlayerTurnPanel"
import Dimmer from './components/Dimmer'
import PlayerInputPanel from './components/PlayerInputPanel'
import GameEventList from './components/GameEventList'
import MenuScreen from './components/MenuScreen'

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
          {this.dimmer}
          <div className="App-body">
            {this.playerInputPanel}
            <div className={`main-content ${this.state.currentPanelFading ? "concealed" : ""}`}>
              <div className="left-container">
                <GameEventList></GameEventList>
              </div>
              <div className="center-container">
                <PlayerTurnPanel playerName="Jack" panelColor="0" />
                <PlayerTurnPanel playerName="Jack" panelColor="1" />
                <PlayerTurnPanel playerName="Jack" panelColor="2" />
                <PlayerTurnPanel playerName="Jack" panelColor="3" />
                <PlayerTurnPanel playerName="Jack" panelColor="4" />
                <PlayerTurnPanel playerName="Jack" panelColor="5" />
              </div>
              <div className="right-container">
                <ChatBar showInputDialogFunction={() => {this.dimmerRef.current.dim(); this.playerInputPanelRef.current.show()}} id="chat-bar"/>
              </div>
            </div>
          </div>
        </div> :
        <div className="App">
          <div className="App-body">
            <MenuScreen app={this}></MenuScreen>
          </div>
        </div>
    )
  }
}