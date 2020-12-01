import React, { useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { useSavedObject } from '@dhis2/app-service-datastore'
import tableReducer from '../reducers/tableReducer'

const TableStateContext = React.createContext()
const TableDispatchContext = React.createContext()
const TableActionsContext = React.createContext()

export function TableProvider({ children, id }) {
    const [savedTable, savedTableActions] = useSavedObject(id)
    const [table, dispatch] = useReducer(tableReducer, savedTable)

    if (table === undefined) {
        console.log(`No table found for ID '${id}'`)
        return <Redirect to="/" />
    }

    return (
        <TableStateContext.Provider value={table}>
            <TableDispatchContext.Provider value={dispatch}>
                <TableActionsContext.Provider value={savedTableActions}>
                    {children}
                </TableActionsContext.Provider>
            </TableDispatchContext.Provider>
        </TableStateContext.Provider>
    )
}

TableProvider.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.element,
}

export function useTableState() {
    const table = useContext(TableStateContext)
    if (table === undefined) {
        throw new Error('useTableState must be used within a TableProvider')
    }
    return table
}

export function useTableDispatch() {
    const dispatch = useContext(TableDispatchContext)
    if (dispatch === undefined) {
        throw new Error('useTableDispatch must be used within a TableProvider')
    }
    return dispatch
}

export function useTableActions() {
    const actions = useContext(TableActionsContext)
    if (actions === undefined) {
        throw new Error('useTableActions must be used within a TableProvider')
    }
    return actions
}

export function useTable() {
    return [useTableState(), useTableDispatch(), useTableActions()]
}
