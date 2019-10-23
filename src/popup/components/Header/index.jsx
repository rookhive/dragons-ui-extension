import React from 'react'

import './index.sass'

export default () => {
    const version = typeof browser === 'undefined'
        ? 'v0.0.1'
        : 'v' + browser.runtime.getManifest().version
    return (
        <header className="header">
            <div className="header__logo">
                <div className="header__hex"><span></span></div>
                <span>Dragons UI</span>
            </div>
            <div className="header__version">{version}</div>
        </header>
    )
}