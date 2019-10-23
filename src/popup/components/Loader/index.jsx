import React from 'react'

import './index.sass'

export default props => {
    const loaderClassName = `loader ${props.section ? `loader_${props.section}` : ''}`
    const loaderStyles = props.top ? { top: props.top } : {}
    return (
        <div
            className={loaderClassName}
            style={loaderStyles}
        ></div>
    )
}