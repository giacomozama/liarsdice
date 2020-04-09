import React, { Component } from "react";
import Die from './Die.js'
import '../App.css';

class PlayerTurnPanel extends Component {
    render () {
        return (
            <div 
              className={`player-turn-panel ${(this.props.activePlayer) ? "active-player" : ""}`}
              pid={this.props.player.gid}>
                <div className="turn-panel-username">
                  <span>{this.props.player.username}</span>
                </div>
                <div className="turn-panel-inner">
                  {this.props.player.dice.map((d, i) => <Die key={`gid${this.props.player.gid}die${i}`} pips={d} />)}
                </div>
            </div>
          );
    }
}

export default PlayerTurnPanel;