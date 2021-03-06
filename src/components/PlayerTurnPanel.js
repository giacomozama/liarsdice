import React, { Component } from "react";
import Die from './Die.js'
import '../App.css';

class PlayerTurnPanel extends Component {
    constructor(props) {
      super(props)

      this.dieRefs = new Array(this.props.player.dice.length)
      this.props.player.dice.forEach((_, i) => {
        this.dieRefs[i] = React.createRef()
      })

      this.dice = this.props.player.dice.map((d, i) => 
        <Die ref={this.dieRefs[i]} key={`gid${this.props.player.gid}die${i}`} pips={d} />)
    }

    rollAllDice(dice) {
      this.dice.forEach( (_, i) => { 
        if (dice.length > i) 
          this.dieRefs[i].current.rollDieToValue(dice[i]) 
        else this.dieRefs[i].current.updateDieWithoutRolling(-1) } )
    }

    endOfRound(dice, highlightedPips) {
      dice.forEach( (d, i) => this.dieRefs[i].current.updateDieWithoutRollingAndHighlightPips(d, highlightedPips) )
      setTimeout(() => this.props.player.dice.forEach((_, i) =>
        this.dieRefs[i].current.updateDieWithoutRolling(this.props.player.dice[i])), 5000)
    }

    render () {
        return (
            <div 
              className={`player-turn-panel ${(this.props.isActivePlayer) ? "active-player" : ""}`}
              pid={this.props.player.gid}>
                <div className="turn-panel-username">
                  <span>{this.props.player.username}</span>
                </div>
                <div className="turn-panel-inner">
                  {this.dice}
                </div>
            </div>
          );
    }
}

export default PlayerTurnPanel;