import React, { Component } from 'react'
import pMinDelay from 'p-min-delay'
import { platform, promisify } from '../../../utils'

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
        // If call storage.local.get directly without a Promise wrapping,
        // it throws an error in Chrome.. In Firefox works fine athough.
        // const features = await pMinDelay(new Promise(resolve => {
        //     platform.storage.local.get(null, data => {
        //         resolve(data)
        //     })
        // }), 500)
        const features = await pMinDelay(promisify(platform.storage.local, 'get', null), 500)
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
                    onSwitch={isEnabled => platform.runtime.sendMessage({
                        type: 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE',
                        data: {
                            feature: name,
                            isEnabled
                        }
                    })}
                    // onSwitch={isEnabled => promisify(platform.runtime, 'sendMessage', {
                    //     type: 'DEAR_BACKGROUND_PLEASE_SWITCH_THE_FEATURE',
                    //     data: {
                    //         feature: name,
                    //         isEnabled
                    //     }
                    // })}
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