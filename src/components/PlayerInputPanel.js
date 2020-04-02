import React from 'react'
import Die from './Die';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PlayerInputPanel extends React.Component {
    constructor(props) {
        super(props)

        //this.maxAmount = this.props.maxAmount
        //this.minAmount = this.props.minAmount
        this.maxAmount = 36
        this.minAmount = 0

        this.state = {
            lastPlayerName: "SOMEONE",
            lastAmount: 5,
            lastDie: 4,
            currentAmount: 1,
            currentPips: 2,
        }

        this.amountPlusButton = <button onClick={() => this.incAmount()} className="btn plusminus-btn"><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>
        this.amountMinusButton = <button onClick={() => this.decAmount()} className="btn plusminus-btn"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon></button>
        this.diePlusButton = <button onClick={() => this.incPips()} className="btn plusminus-btn"><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></button>
        this.dieMinusButton = <button onClick={() => this.decPips()} className="btn plusminus-btn"><FontAwesomeIcon icon={faMinus}></FontAwesomeIcon></button>
        this.statementDie = React.createRef(this.refs.statementDie);
    }

    incAmount() {
        if (this.state.currentAmount < this.maxAmount)
            this.setState({
                currentAmount: this.state.currentAmount + 1
            })
    }

    decAmount() {
        if (this.state.currentAmount > this.minAmount)
            this.setState({
                currentAmount: this.state.currentAmount - 1
            })
    }

    incPips() {
        if (this.state.currentPips < 6) {
            this.setState({
                currentPips: this.state.currentPips + 1
            })
            this.statementDie.current.changePips(this.state.currentPips + 1)
        }
    }

    decPips() {
        if (this.state.currentPips > 1) {
            this.setState({
                currentPips: this.state.currentPips - 1
            })
            this.statementDie.current.changePips(this.state.currentPips - 1)
        }
    }

    render() {
        return (
        <div className="guess-dialog">
            <div className="guess-dialog-upper-panel">
                <div className="previous-statement-panel">
                    <b>{this.state.lastPlayerName}</b>&nbsp;claims there's&nbsp;<b>{this.state.lastAmount}</b>&nbsp;x&nbsp;<Die pips={this.state.lastDie} />
                </div>
                <div className="statement-panel">
                    <div className="statement-subpanel-amount">
                        {this.amountPlusButton}
                        <span>{this.state.currentAmount}</span>
                        {this.amountMinusButton}
                    </div>
                    <div className="statement-subpanel-die">
                        {this.diePlusButton}
                        <Die ref={this.statementDie} pips={this.state.currentPips} />
                        {this.dieMinusButton}
                    </div>
                </div>
            </div>
            <div className="guess-dialog-lower-panel">
                <button className="btn btn-claim"><b>Claim</b> the above</button>
                <button className="btn btn-doubt"><b>Doubt</b> {this.state.lastPlayerName}'s claim</button>
            </div>
        </div> )
    }
}

export default PlayerInputPanel