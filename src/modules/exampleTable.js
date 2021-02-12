import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import tableReducer, {
    ADD_COLUMN,
    ADD_ROW,
    DELETE_COLUMN,
    UPDATE_COLUMN,
    UPDATE_COLUMN_DIMENSIONS,
    UPDATE_ROW_DIMENSIONS,
} from '../reducers/tableReducer'
import i18n from '../locales'

export function getRowActions(table, data) {
    const orgUnits = [
        ...data.lvl1orgUnitRes.organisationUnits,
        ...data.lvl2orgUnitRes.organisationUnits,
    ]
    const actions = []

    orgUnits.forEach((orgUnit, idx) => {
        const addRowAction = { type: ADD_ROW, payload: { name: orgUnit.name } }
        const addDimensionAction = {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: idx + table.rows.length,
                dimensions: { orgUnits: [orgUnit] },
            },
        }
        actions.push(addRowAction, addDimensionAction)
    })

    return actions
}

export function getColumnActions(table, data) {
    const dataItems = [
        ...data.indicatorsRes.indicators,
        ...data.programIndicatorsRes.programIndicators,
        ...data.dataElementsRes.dataElements,
    ].slice(0, 4)
    const actions = []

    // For existing columns, update each data item with one from list
    for (let i = 0; i < dataItems.length; i++) {
        const updateColNameAction = {
            type: UPDATE_COLUMN,
            payload: { idx: i, column: { name: dataItems[i].name } },
        }
        const updateColDimensionAction = {
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx: i,
                dimensions: {
                    item: dataItems[i],
                },
            },
        }
        actions.push(updateColNameAction, updateColDimensionAction)
    }

    // if there are fewer than 4 data items, reduce number of columns in table
    const lengthDif = table.columns.length - dataItems.length
    for (let i = 0; i < lengthDif; i++) {
        const deleteColumnAction = {
            type: DELETE_COLUMN,
            payload: { idx: dataItems.length },
        }
        actions.push(deleteColumnAction)
    }

    // Leave a note if there are no data items for an example table
    // Also, maybe do this for any dataItems < 4?
    if (dataItems.length === 0) {
        const addMessageColumnAction = {
            type: ADD_COLUMN,
            payload: {
                name: i18n.t(
                    'No data items found in instance. Add some data items to see example columns'
                ),
            },
        }
        actions.push(addMessageColumnAction)
    }

    return actions
}

export function createExampleTable(data) {
    // make a series of actions to change table state with reducer
    const actions = [
        ...getRowActions(exampleTable, data),
        ...getColumnActions(exampleTable, data),
    ]
    const finalTable = actions.reduce(tableReducer, exampleTable)
    return finalTable
}

const EXAMPLE_TABLE_QUERY = {
    lvl1orgUnitRes: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            level: 1,
            pageSize: 1,
        },
    },
    lvl2orgUnitRes: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            level: 2,
            pageSize: 4,
        },
    },
    indicatorsRes: {
        resource: 'indicators',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            pageSize: 4,
        },
    },
    // an attempt to fill out columns if there are no indicators in this instance
    // the same could be done for other data types (tracker or event)
    programIndicatorsRes: {
        resource: 'programIndicators',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            pageSize: 4,
        },
    },
    dataElementsRes: {
        resource: 'dataElements',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            pageSize: 4,
        },
    },
}

export function useExampleTable() {
    const [exampleTable, setExampleTable] = useState(null)
    const { loading, error } = useDataQuery(EXAMPLE_TABLE_QUERY, {
        onComplete: data => {
            const exampleTable = createExampleTable(data)
            setExampleTable(exampleTable)
        },
    })

    return { exampleTable, loading, error }
}

// This table is built from the Sierra Leone demo db;
// It is the base that will be changed with a series of operations
// to use the real instance's data
export const exampleTable = {
    name: 'Demo table',
    rows: [
        {
            name: 'Targets',
            cells: [
                {
                    data: {
                        item: {
                            id: 'Uvn6LCg7dVU',
                            name: 'ANC 1 Coverage',
                            dimensionItemType: 'INDICATOR',
                        },
                        group: null,
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [],
                        groupDetail: '',
                    },
                    text: '95%',
                    contentType: 'text',
                    highlightingIntervals: [
                        { lowerBound: '95', color: '#e8f5e9' },
                        { lowerBound: '72', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
                {
                    data: {
                        item: {
                            id: 'OdiHJayrsKo',
                            name: 'ANC 2 Coverage',
                            dimensionItemType: 'INDICATOR',
                        },
                        group: null,
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [],
                        groupDetail: '',
                        groupId: 'ALL',
                    },
                    text: '92%',
                    contentType: 'text',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
                {
                    data: {
                        item: {
                            id: 'sB79w2hiLp8',
                            name: 'ANC 3 Coverage',
                            dimensionItemType: 'INDICATOR',
                        },
                        group: null,
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [],
                        groupDetail: '',
                        groupId: 'ALL',
                    },
                    text: '90%',
                    contentType: 'text',
                    highlightingIntervals: [
                        { lowerBound: '90', color: '#e8f5e9' },
                        { lowerBound: '68', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
                {
                    data: {
                        item: {
                            id: 'AUqdhY4mpvp',
                            name: 'ANC => 4 Coverage',
                            dimensionItemType: 'INDICATOR',
                        },
                        group: null,
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [],
                        groupDetail: '',
                        groupId: 'ALL',
                    },
                    text: '92%',
                    contentType: 'text',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            name: 'ANC 1 Coverage',
            dimensions: {
                orgUnits: [],
                item: {
                    id: 'Uvn6LCg7dVU',
                    name: 'ANC 1 Coverage',
                    dimensionItemType: 'INDICATOR',
                },
                dataType: 'indicators',
                groupId: 'ALL',
                groupDetail: '',
            },
            highlightingIntervals: [
                { lowerBound: '95', color: '#e8f5e9' },
                { lowerBound: '72', color: '#ffecb3' },
                { lowerBound: null, color: '#ffe5e8' },
            ],
        },
        {
            name: 'ANC 2 Coverage',
            dimensions: {
                orgUnits: [],
                item: {
                    id: 'OdiHJayrsKo',
                    name: 'ANC 2 Coverage',
                    dimensionItemType: 'INDICATOR',
                },
                dataType: 'indicators',
                groupId: 'ALL',
                groupDetail: '',
            },
            highlightingIntervals: [
                { lowerBound: '92', color: '#e8f5e9' },
                { lowerBound: '70', color: '#ffecb3' },
                { lowerBound: null, color: '#ffe5e8' },
            ],
        },
        {
            name: 'ANC 3 Coverage',
            dimensions: {
                orgUnits: [],
                item: {
                    id: 'sB79w2hiLp8',
                    name: 'ANC 3 Coverage',
                    dimensionItemType: 'INDICATOR',
                },
                dataType: 'indicators',
                groupId: 'ALL',
                groupDetail: '',
            },
            highlightingIntervals: [
                { lowerBound: '90', color: '#e8f5e9' },
                { lowerBound: '68', color: '#ffecb3' },
                { lowerBound: null, color: '#ffe5e8' },
            ],
        },
        {
            name: 'ANC >= 4 Coverage',
            dimensions: {
                orgUnits: [],
                item: {
                    id: 'AUqdhY4mpvp',
                    name: 'ANC => 4 Coverage',
                    dimensionItemType: 'INDICATOR',
                },
                dataType: 'indicators',
                groupId: 'ALL',
                groupDetail: '',
            },
            highlightingIntervals: [
                { lowerBound: '92', color: '#e8f5e9' },
                { lowerBound: '70', color: '#ffecb3' },
                { lowerBound: null, color: '#ffe5e8' },
            ],
        },
    ],
    highlightingOn: true,
    highlightingIntervals: [
        { lowerBound: '90', color: '#e8f5e9' },
        { lowerBound: '60', color: '#ffecb3' },
        { lowerBound: null, color: '#ffe5e8' },
    ],
    id: '4b5d8f2b-67ae-4fc9-a9c6-9ad8dcceceaa',
}
