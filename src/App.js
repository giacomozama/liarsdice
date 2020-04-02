import React from 'react'
import './App.css'
import ChatBar from "./components/ChatBar"
import PlayerTurnPanel from "./components/PlayerTurnPanel"
import Dimmer from './components/Dimmer'
import PlayerInputPanel from './components/PlayerInputPanel'

let dimmer;

export default class LiarsDice extends React.Component {

  constructor(props) {
    super(props);

    this.playerName = "Jack"

    this.dimmerRef = React.createRef(this.refs.dimmer)
    this.dimmer = <Dimmer ref={this.dimmerRef}/>
  }

  componentDidMount() {
    this.dimmerRef.current.dim()
  }

  render () {
    return (
      <div className="App">
        
        <ChatBar id="chat-bar"/>
        {this.dimmer}
        <PlayerInputPanel></PlayerInputPanel>
        <div className="App-body">
          <div className="main-content">
            <PlayerTurnPanel playerName="Jack" panelColor="0" />
            <PlayerTurnPanel playerName="Jack" panelColor="1" />
            <PlayerTurnPanel playerName="Jack" panelColor="2" />
            <PlayerTurnPanel playerName="Jack" panelColor="3" />
            <PlayerTurnPanel playerName="Jack" panelColor="4" />
            <PlayerTurnPanel playerName="Jack" panelColor="5" />
          </div>
        </div>
      </div>
    )
  }
}