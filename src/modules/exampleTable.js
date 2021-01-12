import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import tableReducer, {
    ADD_ROW,
    DELETE_COLUMN,
    UPDATE_COLUMN,
    UPDATE_COLUMN_DIMENSIONS,
    UPDATE_ROW_DIMENSIONS,
} from '../reducers/tableReducer'

// todo: remove rows - don't need them
// action === { type, payload }

export function getRowActions(table, data) {
    const orgUnits = [
        ...data.lvl1orgUnitRes.organisationUnits,
        ...data.lvl2orgUnitsRes.organisationUnits,
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

    console.log(dataItems)

    // maybe throw an error if dataItems.length == 0
    if (dataItems.length === 0) {
        // Delete columns
        // Make a column with name "No data elements were found to make columns from. ...
        // Create more data elements to construct a more complete example table."
        // Also, maybe do this for any dataItems < 4
    }

    // if there are fewer than 4 data items, reduce number of columns in table
    const lengthDif = table.columns.length - dataItems.length

    // TODO: For existing columns, update data item with one from list
    for (let i = 0; i < dataItems.length; i++) {
        const updateColNameAction = {
            type: UPDATE_COLUMN,
            payload: { name: dataItems[i].name },
        }
        const updateColDimensionAction = {
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx: i,
                dimensions: {
                    dataItem: dataItems[i],
                },
            },
        }
        actions.push(updateColNameAction, updateColDimensionAction)
    }

    // For the rest, delete
    for (let i = 0; i < lengthDif; i++) {
        const deleteColumnAction = {
            type: DELETE_COLUMN,
            payload: { idx: dataItems.length + 1 },
        }
        actions.push(deleteColumnAction)
    }

    return actions
}

export async function createExampleTable(data) {
    console.log(data)
    // make a series of actions to change table state with reducer
    const actions = [
        ...getRowActions(exampleTable, data),
        ...getColumnActions(exampleTable, data),
    ]
    const finalTable = actions.reduce(tableReducer, exampleTable)
    return finalTable
}

export const EXAMPLE_TABLE_QUERY = {
    lvl1orgUnitRes: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            level: 1,
            pageSize: 1,
        },
    },
    lvl2orgUnitsRes: {
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
    // the same could be done for other data types
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
    const table = useState(null)
    const { data, loading, error } = useDataQuery(EXAMPLE_TABLE_QUERY, {
        // TODO: build table with functions above upon completion
        onComplete: console.log,
    })

    console.log(data)
    if (loading || error) return null
    return { table, loading, error }
}

// This table is built from the Sierra Leone demo db;
// It should be changed with a series of actions to use the real instance's data
// TODO: Remove extra rows; create new ones instead of updating them
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
        {
            name: 'National',
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
                        orgUnits: [
                            {
                                id: 'ImspTQPwCqd',
                                name: 'Sierra Leone',
                                path: '/ImspTQPwCqd',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'ImspTQPwCqd',
                                name: 'Sierra Leone',
                                path: '/ImspTQPwCqd',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'ImspTQPwCqd',
                                name: 'Sierra Leone',
                                path: '/ImspTQPwCqd',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'ImspTQPwCqd',
                                name: 'Sierra Leone',
                                path: '/ImspTQPwCqd',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
            ],
            dimensions: {
                item: null,
                groupId: 'ALL',
                periods: [],
                dataType: 'indicators',
                groupDetail: '',
                orgUnits: [
                    {
                        id: 'ImspTQPwCqd',
                        name: 'Sierra Leone',
                        path: '/ImspTQPwCqd',
                    },
                ],
            },
        },
        {
            name: 'Tonkolili',
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
                        orgUnits: [
                            {
                                id: 'eIQbndfxQMb',
                                name: 'Tonkolili',
                                path: '/ImspTQPwCqd/eIQbndfxQMb',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'eIQbndfxQMb',
                                name: 'Tonkolili',
                                path: '/ImspTQPwCqd/eIQbndfxQMb',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'eIQbndfxQMb',
                                name: 'Tonkolili',
                                path: '/ImspTQPwCqd/eIQbndfxQMb',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'eIQbndfxQMb',
                                name: 'Tonkolili',
                                path: '/ImspTQPwCqd/eIQbndfxQMb',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
            ],
            dimensions: {
                item: null,
                groupId: 'ALL',
                dataType: 'indicators',
                groupDetail: '',
                orgUnits: [
                    {
                        id: 'eIQbndfxQMb',
                        name: 'Tonkolili',
                        path: '/ImspTQPwCqd/eIQbndfxQMb',
                    },
                ],
            },
        },
        {
            name: 'Kailahun',
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
                        orgUnits: [
                            {
                                id: 'jUb8gELQApl',
                                name: 'Kailahun',
                                path: '/ImspTQPwCqd/jUb8gELQApl',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'jUb8gELQApl',
                                name: 'Kailahun',
                                path: '/ImspTQPwCqd/jUb8gELQApl',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'jUb8gELQApl',
                                name: 'Kailahun',
                                path: '/ImspTQPwCqd/jUb8gELQApl',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'jUb8gELQApl',
                                name: 'Kailahun',
                                path: '/ImspTQPwCqd/jUb8gELQApl',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
            ],
            dimensions: {
                item: null,
                groupId: 'ALL',
                dataType: 'indicators',
                groupDetail: '',
                orgUnits: [
                    {
                        id: 'jUb8gELQApl',
                        name: 'Kailahun',
                        path: '/ImspTQPwCqd/jUb8gELQApl',
                    },
                ],
            },
        },
        {
            name: 'Bombali',
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
                        orgUnits: [
                            {
                                id: 'fdc6uOvgoji',
                                name: 'Bombali',
                                path: '/ImspTQPwCqd/fdc6uOvgoji',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'fdc6uOvgoji',
                                name: 'Bombali',
                                path: '/ImspTQPwCqd/fdc6uOvgoji',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'fdc6uOvgoji',
                                name: 'Bombali',
                                path: '/ImspTQPwCqd/fdc6uOvgoji',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
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
                        groupId: 'ALL',
                        periods: [],
                        dataType: 'indicators',
                        orgUnits: [
                            {
                                id: 'fdc6uOvgoji',
                                name: 'Bombali',
                                path: '/ImspTQPwCqd/fdc6uOvgoji',
                            },
                        ],
                        groupDetail: '',
                    },
                    text: '',
                    contentType: 'data',
                    highlightingIntervals: [
                        { lowerBound: '92', color: '#e8f5e9' },
                        { lowerBound: '70', color: '#ffecb3' },
                        { lowerBound: null, color: '#ffe5e8' },
                    ],
                },
            ],
            dimensions: {
                item: null,
                groupId: 'ALL',
                dataType: 'indicators',
                groupDetail: '',
                orgUnits: [
                    {
                        id: 'fdc6uOvgoji',
                        name: 'Bombali',
                        path: '/ImspTQPwCqd/fdc6uOvgoji',
                    },
                ],
            },
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
