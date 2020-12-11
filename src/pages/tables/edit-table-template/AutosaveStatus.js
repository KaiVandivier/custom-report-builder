import React, { useState, useEffect } from 'react'
import { Help } from '@dhis2/ui'
import i18n from '../../../locales'
import { useTableState } from '../../../context/tableContext'

const TimeFormat = new Intl.DateTimeFormat([], {
    timeStyle: 'short',
})

function AutosaveStatus() {
    const table = useTableState()
    const [time, setTime] = useState(null)

    // update time when table is update
    useEffect(() => {
        console.log('using time effect')
        console.log(TimeFormat.format(new Date()))
        setTime(TimeFormat.format(new Date()))
    }, [table])

    return (
        <Help>
            {i18n.t(
                'Changes are saved automatically. Last saved at {{time}}.',
                { time }
            )}
        </Help>
    )
}

AutosaveStatus.propTypes = {}

export default AutosaveStatus
