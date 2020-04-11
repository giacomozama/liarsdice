import React from 'react'
import Die from './Die';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PlayerInputPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            currentAmount: 1,
            currentPips: 2,
            maxAmount: 36,
            minAmount: 0,
            minWCAmount: 0,
            previousAmount: null,
            previousPips: null,
            previousPlayer: null
        }

        this.amountPlusButton = <button onClick={() => this.incAmount()} className="btn plusminus-btn"><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>
        this.amountMinusButton = <button onClick={() => this.decAmount()} className="btn plusminus-btn"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon></button>
        this.diePlusButton = <button onClick={() => this.incPips()} className="btn plusminus-btn"><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>
        this.dieMinusButton = <button onClick={() => this.decPips()} className="btn plusminus-btn"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon></button>
        this.statementDieRef = React.createRef(this.refs.statementDieRef);
    }

    showInputDialog(previousAmount, previousPips, previousPlayer) {
        if (this.props.app.dimmerRef.current)
            this.props.app.dimmerRef.current.dim()
        const newMinWCAmount = 
            (previousAmount) ? 
                ((previousPips !== 1) ?
                    Math.floor(previousAmount / 2) + 1
                    : previousAmount + 1)
                : 1
        this.setState({
            minAmount: (previousAmount) ? (previousAmount + 1 > newMinWCAmount ? previousAmount + 1 : newMinWCAmount) : 1,
            currentAmount: (previousAmount) ? previousAmount + 1 : 1,
            minWCAmount: newMinWCAmount,
            currentPips: (previousPips) ? previousPips : 2,
            previousAmount: (previousAmount) ? previousAmount : 1, 
            previousPips: (previousPips) ? previousPips : 2, 
            previousPlayer: previousPlayer,
            visible: true
        })
    }

    incAmount() {
        if (this.state.currentAmount < this.state.maxAmount)
            this.setState({
                currentAmount: this.state.currentAmount + 1
            })
    }

    decAmount() {
        if ((this.state.currentPips === 1 && this.state.currentAmount > this.state.minWCAmount) ||
                (this.state.currentPips !== 1 && this.state.currentAmount > this.state.minAmount) )
            this.setState({
                currentAmount: this.state.currentAmount - 1
            })
    }

    incPips() {
        if (this.state.currentPips < 6) {
            if (this.state.currentPips === 1) {
                this.setState({
                    currentAmount: this.state.minAmount,
                    currentPips: this.state.currentPips + 1
                })
            } else {
                this.setState({
                    currentPips: this.state.currentPips + 1
                })
            }
            this.statementDieRef.current.updateDieWithoutRolling(this.state.currentPips + 1)
        }
    }

    decPips() {
        if (this.state.currentPips > 1) {
            if (this.state.currentPips === 2) {
                this.setState({
                    currentAmount: this.state.minWCAmount,
                    currentPips: this.state.currentPips - 1
                })
            } else {
                this.setState({
                    currentPips: this.state.currentPips - 1
                })
            }
            this.statementDieRef.current.updateDieWithoutRolling(this.state.currentPips - 1)
        }
    }

    hide() {
        this.setState({
            visible: false
        })
        if (this.props.app.dimmerRef.current)
            this.props.app.dimmerRef.current.undim()
    }

    render() {
        return (
            this.state.visible ?
                <div className="guess-dialog">
                    <div className="guess-dialog-upper-panel">
                        { (this.state.previousPlayer) ? <div className="previous-statement-panel">
                            <b>{this.state.previousPlayer}</b>&nbsp;claims there's&nbsp;<b>{this.state.previousAmount}</b>&nbsp;x&nbsp;<Die pips={this.state.previousPips} />
                        </div> : null }
                        <div className="your-dice-label">Your dice:</div>
                        <div className="guess-panel-die-tray">
                            {this.props.app.findPlayerByGid(this.props.app.state.myGid).dice.map(d => <Die pips={d} />)}
                        </div>
                        <div className="statement-panel">
                            <div className="statement-subpanel-amount">
                                {this.amountPlusButton}
                                <span>{this.state.currentAmount}</span>
                                {this.amountMinusButton}
                            </div>
                            <div className="statement-subpanel-die">
                                {this.diePlusButton}
                                <Die ref={this.statementDieRef} pips={this.state.currentPips} />
                                {this.dieMinusButton}
                            </div>
                        </div>
                    </div>
                    <div className="guess-dialog-lower-panel">
                        <button className="btn btn-claim" onClick={() => {
                            this.props.app.gameController.claim(this.state.currentAmount, this.state.currentPips)
                            this.hide()
                        }}><b>Claim</b> the above</button>
                        { this.state.previousPlayer ? <button className="btn btn-doubt" onClick={() => {
                            this.props.app.gameController.doubt()
                            this.hide()
                        }}><b>Doubt</b> {this.state.previousPlayer}'s claim</button> : null }
                    </div>
                </div> : null)
    }
}

export default PlayerInputPanel