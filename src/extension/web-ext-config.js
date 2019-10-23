module.exports = {
    run: {
        firefox: 'firefox',
        keepProfileChanges: true,
        startUrl: ['www.mist-game.ru'],
        pref: [
            'browser.link.open_external=3',
            'browser.link.open_newwindow=3',

            'dom.ipc.plugins.reportCrashURL=false',
            'dom.ipc.plugins.flash.subprocess.crashreporter.enabled=false',
            'security.ssl.errorReporting.enabled=false',
            'toolkit.crashreporter.infoURL=""',

            'browser.ping-centre.telemetry=false',
            'browser.library.activity-stream.enabled=false',
            'browser.newtabpage.activity-stream.feeds.section.highlights=false',
            'browser.newtabpage.activity-stream.feeds.telemetry=false',
            'browser.newtabpage.activity-stream.telemetry=false',
            'browser.newtabpage.activity-stream.telemetry.ping.endpoint=""',
            'browser.newtabpage.activity-stream.tippyTop.service.endpoint=""',

            'datareporting.healthreport.uploadEnabled=false',
            'datareporting.policy.dataSubmissionEnabled=false',
            'datareporting.policy.firstRunURL=""'
        ]
    }
}