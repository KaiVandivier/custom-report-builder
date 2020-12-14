import React, { useContext } from 'react'
import PropTypes from 'prop-types'

// To avoid using mutable objects, this context could use a reducer;
// eg, 'GET_ITEM' and 'SET_ITEM' to get and set footnote items

const OrgUnitFootnotesContext = React.createContext()
const PeriodFootnotesContext = React.createContext()

export function FootnotesProvider({ children }) {
    return (
        <OrgUnitFootnotesContext.Provider value={new Map()}>
            <PeriodFootnotesContext.Provider value={new Map()}>
                {children}
            </PeriodFootnotesContext.Provider>
        </OrgUnitFootnotesContext.Provider>
    )
}

FootnotesProvider.propTypes = {
    children: PropTypes.element,
}

export function useOrgUnitFootnotes() {
    const orgUnitFootnotes = useContext(OrgUnitFootnotesContext)

    if (orgUnitFootnotes === undefined)
        throw new Error(
            'useOrgUnitFootnotes must be used within a FootnotesProvider'
        )

    return orgUnitFootnotes
}

export function usePeriodFootnotes() {
    const periodFootnotes = useContext(PeriodFootnotesContext)

    if (periodFootnotes === undefined)
        throw new Error(
            'usePeriodFootnotes must be used within a FootnotesProvider'
        )

    return periodFootnotes
}

export function useFootnotes() {
    return {
        orgUnitFootnotes: useOrgUnitFootnotes(),
        periodFootnotes: usePeriodFootnotes(),
    }
}
