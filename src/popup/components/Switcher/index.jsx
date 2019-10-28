import React, { Component } from 'react'
import pMinDelay from 'p-min-delay'

import './index.sass'
import Loader from '../Loader'

export default class Switcher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            switchedOn: props.mode
        }
    }

    onSwitch = async () => {
        const { onSwitch, onSwitchOn, onSwitchOff } = this.props
        const newMode = !this.state.switchedOn
        this.setState(() => ({
            isLoading: true
        }))
        if (onSwitch) {
            const result = await pMinDelay(onSwitch(newMode), 300)
            if (result.error) {
                throw new Error(result.error)
            }
        }
        if (newMode) {
            onSwitchOn && onSwitchOn()
        } else {
            onSwitchOff && onSwitchOff()
        }
        this.setState(() => ({
            isLoading: false,
            switchedOn: newMode
        }))
    }

    render() {
        const { isLoading, switchedOn } = this.state
        let switcherClassName = 'switcher'
        switchedOn && (switcherClassName += ' switcher_enabled')
        isLoading && (switcherClassName += ' switcher_loading')
        return (
            <div className={switcherClassName} onClick={isLoading ? null : this.onSwitch}>
                <div className="switcher__box">
                    <div className="switcher__track"></div>
                    <div className="switcher__slider"></div>
                </div>
                {this.props.children}
                <div className={`switcher__loader ${isLoading ? 'switcher__loader_loading' : ''}`}>
                    {isLoading && <Loader section="small"/>}
                </div>
            </div>
        )
    }
}