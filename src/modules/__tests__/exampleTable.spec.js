import { ADD_ROW, UPDATE_ROW_DIMENSIONS } from '../../reducers/tableReducer'
import {
    exampleTable,
    // createExampleTable,
    getRowActions,
    // getColumnActions,
} from '../exampleTable'

// A fake API result for testing
// (Pager and extra data items could be removed?)
const testData = {
    lvl1orgUnitRes: {
        pager: {
            page: 1,
            pageCount: 1332,
            total: 1332,
            pageSize: 1,
            nextPage:
                'http://localhost:8080/api/35/organisationUnits?page=2&pageSize=1&level=1&fields=id%2CdisplayName%7Erename%28name%29',
        },
        organisationUnits: [
            {
                id: 'ImspTQPwCqd',
                name: 'Sierra Leone',
            },
        ],
    },
    lvl2orgUnitsRes: {
        pager: {
            page: 1,
            pageCount: 333,
            total: 1332,
            pageSize: 4,
            nextPage:
                'http://localhost:8080/api/35/organisationUnits?page=2&pageSize=4&level=2&fields=id%2CdisplayName%7Erename%28name%29',
        },
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
        pager: {
            page: 1,
            pageCount: 20,
            total: 77,
            pageSize: 4,
            nextPage:
                'http://localhost:8080/api/35/indicators?page=2&pageSize=4&fields=id%2CdisplayName%7Erename%28name%29',
        },
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
        pager: {
            page: 1,
            pageCount: 30,
            total: 117,
            pageSize: 4,
            nextPage:
                'http://localhost:8080/api/35/programIndicators?page=2&pageSize=4&fields=id%2CdisplayName%7Erename%28name%29',
        },
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
        pager: {
            page: 1,
            pageCount: 259,
            total: 1035,
            pageSize: 4,
            nextPage:
                'http://localhost:8080/api/35/dataElements?page=2&pageSize=4&fields=id%2CdisplayName%7Erename%28name%29',
        },
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
                name: testData.lvl2orgUnitsRes.organisationUnits[0].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 1,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitsRes.organisationUnits[0] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitsRes.organisationUnits[1].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 2,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitsRes.organisationUnits[1] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitsRes.organisationUnits[2].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 3,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitsRes.organisationUnits[2] },
                    ],
                },
            },
        },
        {
            type: ADD_ROW,
            payload: {
                name: testData.lvl2orgUnitsRes.organisationUnits[3].name,
            },
        },
        {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: exampleTable.rows.length + 4,
                dimensions: {
                    orgUnits: [
                        { ...testData.lvl2orgUnitsRes.organisationUnits[3] },
                    ],
                },
            },
        },
    ]

    expect(actions).toEqual(expected)
})

it('correctly produces reducer actions for column actions', () => {
    // TODO
    // const actions = getColumnActions(exampleTable, testData)
})
