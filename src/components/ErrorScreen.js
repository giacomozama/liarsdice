import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

class ErrorScreen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            errorMessage: ""
        }
    }

    showError(errorMessage) {
        this.props.dimmerRef.current.dim()
        this.setState({
            visible: true,
            errorMessage: errorMessage
        })
    }

    render() {
        return (
            (this.state.visible) ?
            <div className="error-screen">
                <div className="error-screen-header">
                    <div className="error-screen-symbol-container">
                        <FontAwesomeIcon className="error-screen-symbol" icon={faExclamationCircle} ></FontAwesomeIcon>
                    </div>
                    <div className="error-screen-message-container">{this.state.errorMessage}</div>
                </div>
                <div className="error-screen-footer">
                    <button className="btn" onClick={() => {this.props.dimmerRef.current.undim(); this.setState({visible: false})}}>CLOSE</button>
                </div>
            </div> : null)
    }
}

export default ErrorScreen