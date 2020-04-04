import React, { Component } from "react";
import Die from './Die.js'
import '../App.css';

class PlayerTurnPanel extends Component {

    constructor(props) {
        super(props);

        this.panelColor = props.panelColor;
        this.playerName = props.playerName;
        this.dice = [];
        for (let i = 1; i <= 6; i++)
          this.dice.push(<Die key={"die" + i} pips={0} />);
    }

    render () {
        return (
            <div 
              className="player-turn-panel"
              pid={this.panelColor}>
                <div className="turn-panel-username">
                  <span>{this.playerName}</span>
                </div>
                <div className="turn-panel-inner">
                  {this.dice}
                </div>
            </div>
          );
    }
}

export default PlayerTurnPanel;