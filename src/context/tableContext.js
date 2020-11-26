import React, { useContext, useReducer } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { useSavedObject } from '@dhis2/app-service-datastore'
import tableReducer from '../reducers/tableReducer'

const TableStateContext = React.createContext()
const TableDispatchContext = React.createContext()
const TableActionsContext = React.createContext()

// If this is adapted for use in other apps, accept `id` as a prop
// In this app, parent Route can pass `id` via `match.params.id`

export function TableProvider({ children }) {
    // TODO: validate params.id
    const params = useParams()
    const [savedTable, savedTableActions] = useSavedObject(params.id)
    const [table, dispatch] = useReducer(tableReducer, savedTable)

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
    children: PropTypes.element,
}

export function useTableState() {
    const table = useContext(TableStateContext)
    // This might also throw if a table is not found for the id in url params
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
