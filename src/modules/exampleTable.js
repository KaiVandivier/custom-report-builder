import { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'

// export async function createExampleTable(engine) {
// use exampleTable
// Query level 1 org unit
// Query level 2 org units
// Query 4 indicators
// }

const EXAMPLE_TABLE_QUERY = {
    lvl1ou: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            level: 1,
            pageSize: 1,
        },
    },
    lvl2ous: {
        resource: 'organisationUnits',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            level: 2,
            pageSize: 4,
        },
    },
    indicators: {
        resource: 'indicators',
        params: {
            fields: ['id', 'displayName~rename(name)'],
            pageSize: 4,
        },
    },
}

export function useExampleTable() {
    const table = useState(null)
    const { data, loading, error } = useDataQuery(EXAMPLE_TABLE_QUERY, {
        onComplete: console.log,
    })

    if (loading || error) return null
    console.log(data)
    return { table, loading, error }
}

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
