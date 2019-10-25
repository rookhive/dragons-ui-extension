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
            features: null
        }
    }

    async componentDidMount() {
        const features = await pMinDelay(browser.storage.local.get(null), 500)
        this.setState(() => ({ features }))
    }

    getFeatureSwitchers() {
        const { features } = this.state
        return Object.entries(combinedConfig)
            .map(values => values[1])
            .map(({ name, title }, i) => (
                <Switcher
                    key={i}
                    mode={features[name]}
                    onSwitch={isEnabled => browser.runtime.sendMessage({
                        type: 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE',
                        data: {
                            feature: name,
                            isEnabled
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
                    this.state.features
                        ? this.getFeatureSwitchers()
                        : <Loader />
                }
            </div>
        )
    }
}