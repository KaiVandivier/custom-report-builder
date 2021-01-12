import {
    ADD_COLUMN,
    ADD_ROW,
    DELETE_COLUMN,
    UPDATE_COLUMN,
    UPDATE_COLUMN_DIMENSIONS,
    UPDATE_ROW_DIMENSIONS,
} from '../../reducers/tableReducer'
import {
    exampleTable,
    // createExampleTable,
    getRowActions,
    getColumnActions,
} from '../exampleTable'

const testIndicatorsRes = {
    indicators: [
        {
            id: 'Uvn6LCg7dVU',
            name: 'ANC 1 Coverage',
        },
        {
            id: 'ReUHfIn0pTQ',
            name: 'ANC 1-3 Dropout Rate',
        },
        {
            id: 'OdiHJayrsKo',
            name: 'ANC 2 Coverage',
        },
        {
            id: 'sB79w2hiLp8',
            name: 'ANC 3 Coverage',
        },
    ],
}

const testProgramIndicatorsRes = {
    programIndicators: [
        {
            id: 'GSae40Fyppf',
            name: 'Age at visit',
        },
        {
            id: 'dSBYyCUjCXd',
            name: 'Age at visit - calc from days',
        },
        {
            id: 'tUdBD1JDxpn',
            name: 'Average age of deaths',
        },
    ],
}

const testDataElementsRes = {
    dataElements: [
        {
            id: 'FTRrcoaog83',
            name: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
        },
        {
            id: 'P3jJH5Tu5VC',
            name: 'Acute Flaccid Paralysis (AFP) follow-up',
        },
    ],
}

// A fake API result for testing
// (Pager and extra data items could be removed?)
const testData = {
    lvl1orgUnitRes: {
        organisationUnits: [
            {
                id: 'ImspTQPwCqd',
                name: 'Sierra Leone',
            },
        ],
    },
    lvl2orgUnitRes: {
        organisationUnits: [
            {
                id: 'O6uvpzGd5pu',
                name: 'Bo',
            },
            {
                id: 'fdc6uOvgoji',
                name: 'Bombali',
            },
            {
                id: 'lc3eMKXaEfw',
                name: 'Bonthe',
            },
            {
                id: 'jUb8gELQApl',
                name: 'Kailahun',
            },
        ],
    },
    indicatorsRes: { indicators: [] },
    programIndicatorsRes: { programIndicators: [] },
    dataElementsRes: { dataElements: [] },
}

it('correctly produces a set of reducer actions for the given table', () => {
    const actions = getRowActions(exampleTable, testData)
    const expected = [
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl1orgUnitRes.organisationUnits[0].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 0,
                dimensions: {
                    orgUnits: [...testData.lvl1orgUnitRes.organisationUnits],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitRes.organisationUnits[0].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 1,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitRes.organisationUnits[0] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitRes.organisationUnits[1].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 2,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitRes.organisationUnits[1] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitRes.organisationUnits[2].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 3,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitRes.organisationUnits[2] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitRes.organisationUnits[3].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 4,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitRes.organisationUnits[3] },
                    ],
                },
            },
        },
    ]

    expect(actions).toEqual(expected)
})

describe('getting column actions', () => {
    it('correctly produces reducer actions for column actions', () => {
        const testDataWithIndicators = {
            ...testData,
            indicatorsRes: { ...testIndicatorsRes },
        }
        const actions = getColumnActions(exampleTable, testDataWithIndicators)
        const expected = [
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 0,
                    column: { name: testIndicatorsRes.indicators[0].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 0,
                    dimensions: {
                        dataItem: { ...testIndicatorsRes.indicators[0] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 1,
                    column: { name: testIndicatorsRes.indicators[1].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 1,
                    dimensions: {
                        dataItem: { ...testIndicatorsRes.indicators[1] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 2,
                    column: { name: testIndicatorsRes.indicators[2].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 2,
                    dimensions: {
                        dataItem: { ...testIndicatorsRes.indicators[2] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 3,
                    column: { name: testIndicatorsRes.indicators[3].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 3,
                    dimensions: {
                        dataItem: { ...testIndicatorsRes.indicators[3] },
                    },
                },
            },
        ]

        expect(actions).toEqual(expected)
    })

    it('correctly handles < 4 and > 0 data items', () => {
        // ...by updating the relevant columns and deleting the rest.
        // there are 3 program indicators
        const testDataWithProgramIndicators = {
            ...testData,
            programIndicatorsRes: { ...testProgramIndicatorsRes },
        }
        const actions = getColumnActions(
            exampleTable,
            testDataWithProgramIndicators
        )

        // 3x update_column actions, 3x update_column_dimensinos, 1x delete_column
        expect(actions.length).toBe(7)
        expect(actions[actions.length - 1]).toEqual({
            type: DELETE_COLUMN,
            payload: { idx: 3 },
        })
    })

    it('correctly handles 0 data items', () => {
        // ...by inserting a column with a descriptive name.
        // There are 0 data items returned in testData
        const actions = getColumnActions(exampleTable, testData)
        console.log(actions)

        // 4x delete_column actions, 1x add_column
        expect(actions.length).toBe(5)
        expect(actions[0]).toEqual({ type: DELETE_COLUMN, payload: { idx: 0 } })
        expect(actions[actions.length - 1]).toEqual({
            type: ADD_COLUMN,
            payload: {
                name:
                    'No data items found in instance. Add some data items to see example columns',
            },
        })
    })

    it('successfully falls back to other data types if no indicators available', () =>
        console.log(testDataElementsRes))
    // ...by making columns out of program indicators and data elements
})

it.todo('creates a whole table')
