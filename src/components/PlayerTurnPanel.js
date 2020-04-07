import React, { Component } from "react";
import Die from './Die.js'
import '../App.css';

class PlayerTurnPanel extends Component {

    constructor(props) {
        super(props);

        this.playerName = props.playerName;

    }

    changeDice(newDice) {
      const t = []
      for (let i = 0; i < newDice.length; i++)
        t.push(newDice[i])
      for (let i = 0; i < newDice.length - t.length; i++)
        t.push(-1)

      this.setState({
        dice: t
      })
    }

    render () {
        return (
            <div 
              className="player-turn-panel"
              pid={this.props.pId}>
                <div className="turn-panel-username">
                  <span>{this.playerName}</span>
                </div>
                <div className="turn-panel-inner">
                  {this.props.app.state.dice[this.props.pId].map((d, i) => <Die key={`die${this.props.pId}${i}`} pips={d[i]} />)}
                </div>
            </div>
          );
    }
}

export default PlayerTurnPanel;