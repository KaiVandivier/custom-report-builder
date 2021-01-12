import {
    ADD_ROW,
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
    indicatorsRes: {
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
    },
    programIndicatorsRes: {
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
            {
                id: 'sGna2pquXOO',
                name: 'Average age of female discharges',
            },
        ],
    },
    dataElementsRes: {
        dataElements: [
            {
                id: 'FTRrcoaog83',
                name: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
            },
            {
                id: 'P3jJH5Tu5VC',
                name: 'Acute Flaccid Paralysis (AFP) follow-up',
            },
            {
                id: 'FQ2o8UBlcrS',
                name: 'Acute Flaccid Paralysis (AFP) new',
            },
            {
                id: 'M62VHgYT2n0',
                name: 'Acute Flaccid Paralysis (AFP) referrals',
            },
        ],
    },
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
        const actions = getColumnActions(exampleTable, testData)
        const expected = [
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 0,
                    column: { name: testData.indicatorsRes.indicators[0].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 0,
                    dimensions: {
                        dataItem: { ...testData.indicatorsRes.indicators[0] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 1,
                    column: { name: testData.indicatorsRes.indicators[1].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 1,
                    dimensions: {
                        dataItem: { ...testData.indicatorsRes.indicators[1] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 2,
                    column: { name: testData.indicatorsRes.indicators[2].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 2,
                    dimensions: {
                        dataItem: { ...testData.indicatorsRes.indicators[2] },
                    },
                },
            },
            {
                type: UPDATE_COLUMN,
                payload: {
                    idx: 3,
                    column: { name: testData.indicatorsRes.indicators[3].name },
                },
            },
            {
                type: UPDATE_COLUMN_DIMENSIONS,
                payload: {
                    idx: 3,
                    dimensions: {
                        dataItem: { ...testData.indicatorsRes.indicators[3] },
                    },
                },
            },
        ]

        expect(actions).toEqual(expected)
    })

    it('correctly handles < 4 and > 0 data items', () => {
        // ...by updating the relevant columns and deleting the rest
    })

    it.todo('correctly handles 0 data items')
    // ...by inserting a column with a descriptive name

    it.todo(
        'successfully falls back to other data types if no indicators available'
    )
    // ...by making columns out of program indicators and data elements
})

it.todo('creates a whole table')
