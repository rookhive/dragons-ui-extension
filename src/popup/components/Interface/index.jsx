import React, { Component } from 'react'

import './index.sass'
import Switcher from '../Switcher'
import platform from '../../../platform'
import combinedConfig from '../../../features/combinedConfig'

export default class Interface extends Component {

    render() {
        return (
            <div className="interface">
                {
                    Object.entries(combinedConfig)
                        .map(values => values[1])
                        .map(({ id, title }, i) => (
                            <Switcher
                                key={i}
                                onSwitch={async function (isEnabled) {
                                    console.log('Переключатель переключен в положение', isEnabled)
                                    const result = await platform.runtime.sendMessage({
                                        type: 'SET_FEATURE',
                                        data: {
                                            feature: id,
                                            isEnabled
                                        }
                                    })
                                    console.log('Результат включения:', result)
                                }}
                            >
                                <div className="interface__switcher-button">{title}</div>
                            </Switcher>
                        ))
                }
            </div>
        )
    }
}