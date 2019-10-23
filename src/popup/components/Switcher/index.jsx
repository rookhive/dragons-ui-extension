import React, { Component } from 'react'

import './index.sass'

export default class Switcher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            switchedOn: false
        }
    }

    onSwitch = () => {
        const { onSwitch, onSwitchOn, onSwitchOff } = this.props
        const newMode = !this.state.switchedOn
        this.setState(() => ({
            switchedOn: newMode
        }))
        onSwitch && onSwitch(newMode)
        if (newMode) {
            onSwitchOn && onSwitchOn()
        } else {
            onSwitchOff && onSwitchOff()
        }
    }

    render() {
        const switcherClassName = `switcher ${this.state.switchedOn ? 'switcher_enabled' : ''}`
        return (
            <div className={switcherClassName} onClick={this.onSwitch}>
                <div className="switcher__box">
                    <div className="switcher__track"></div>
                    <div className="switcher__slider"></div>
                </div>
                {this.props.children}
            </div>
        )
    }
}