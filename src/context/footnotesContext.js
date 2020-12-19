import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'

const OrgUnitFootnotesContext = React.createContext()
const PeriodFootnotesContext = React.createContext()

export function FootnotesProvider({ children }) {
    const [orgUnitFootnotes, setOrgUnitFootnotes] = useState(new Map())
    const [periodFootnotes, setPeriodFootnotes] = useState(new Map())

    return (
        <OrgUnitFootnotesContext.Provider
            value={[orgUnitFootnotes, setOrgUnitFootnotes]}
        >
            <PeriodFootnotesContext.Provider
                value={[periodFootnotes, setPeriodFootnotes]}
            >
                {children}
            </PeriodFootnotesContext.Provider>
        </OrgUnitFootnotesContext.Provider>
    )
}

FootnotesProvider.propTypes = {
    children: PropTypes.element,
}

export function useOrgUnitFootnotes() {
    const [orgUnitFootnotes, setOrgUnitFootnotes] = useContext(
        OrgUnitFootnotesContext
    )

    if ([orgUnitFootnotes, setOrgUnitFootnotes] === undefined)
        throw new Error(
            'useOrgUnitFootnotes must be used within a FootnotesProvider'
        )

    return [orgUnitFootnotes, setOrgUnitFootnotes]
}

export function usePeriodFootnotes() {
    const [periodFootnotes, setPeriodFootnotes] = useContext(
        PeriodFootnotesContext
    )

    if ([periodFootnotes, setPeriodFootnotes] === undefined)
        throw new Error(
            'usePeriodFootnotes must be used within a FootnotesProvider'
        )

    return [periodFootnotes, setPeriodFootnotes]
}

export function useFootnotes() {
    const [periodFootnotes, setPeriodFootnotes] = usePeriodFootnotes()
    const [orgUnitFootnotes, setOrgUnitFootnotes] = useOrgUnitFootnotes()

    return {
        orgUnitFootnotes,
        setOrgUnitFootnotes,
        periodFootnotes,
        setPeriodFootnotes,
    }
}
