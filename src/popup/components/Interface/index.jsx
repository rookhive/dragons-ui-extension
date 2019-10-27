import React, { Component } from 'react'
import pMinDelay from 'p-min-delay'

import './index.sass'
import Switcher from '../Switcher'
import Loader from '../Loader'
import combinedConfig from '../../../features/combinedConfig'

export default class Interface extends Component {
    constructor(props) {
        super(props)
        this.state = {
            savedFeatureModes: null
        }
    }

    async componentDidMount() {
        const savedFeatureModes = await pMinDelay(browser.storage.local.get(null), 500)
        this.setState(() => ({ savedFeatureModes }))
    }

    getFeatureSwitchers() {
        const { savedFeatureModes } = this.state
        return Object.entries(combinedConfig)
            .map(values => values[1])
            .map(({ name, title }, i) => (
                <Switcher
                    key={i}
                    mode={savedFeatureModes[name]}
                    onSwitch={mode => browser.runtime.sendMessage({
                        type: 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE',
                        data: {
                            name,
                            mode
                        }
                    })}
                >
                    <div className="interface__switcher-button">{title}</div>
                </Switcher>
            ))
    }

    render() {
        return (
            <div className="interface">
                {
                    this.state.savedFeatureModes
                        ? this.getFeatureSwitchers()
                        : <Loader />
                }
            </div>
        )
    }
}