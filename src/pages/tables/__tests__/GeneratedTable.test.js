import { isAllPopulatedInTable } from '../GeneratedTable'

// if all are populated, should cause 'true'
const populatedDataCell = {
    contentType: 'data',
    data: {
        item: { id: '123', name: 'abc' },
        orgUnits: [{ id: '123', name: 'abc' }],
        periods: [{ id: '123', name: 'abc' }],
    },
}

// should cause 'false'
const unpopulatedDataCellWithItem = {
    contentType: 'data',
    data: {
        item: { id: '123', name: 'abc' },
        orgUnits: [],
        periods: [],
    },
}

// should be ignored
const unpopulatedDataCellWithoutItem = {
    contentType: 'data',
    data: {
        item: null,
        orgUnits: [],
        periods: [],
    },
}

// should be ignored
const nonDataCell = {
    contentType: 'text',
    data: { item: null },
}

const allPopulatedTable = {
    rows: [
        {
            cells: [{ ...populatedDataCell }, { ...populatedDataCell }],
        },
        {
            cells: [{ ...populatedDataCell }, { ...populatedDataCell }],
        },
    ],
}

const allIgnoredCellsTable = {
    rows: [
        {
            cells: [{ ...nonDataCell }, { ...nonDataCell }],
        },
        {
            cells: [
                { ...unpopulatedDataCellWithoutItem },
                { ...unpopulatedDataCellWithoutItem },
            ],
        },
    ],
}

const notAllPopulatedTable = {
    rows: [
        {
            cells: [{ ...populatedDataCell }, { ...nonDataCell }],
        },
        {
            cells: [
                { ...unpopulatedDataCellWithoutItem },
                { ...unpopulatedDataCellWithItem }, // should cause 'false'
            ],
        },
    ],
}

describe('isAllPopulated helper function', () => {
    it('correctly confirms all are populated', () => {
        const pe = isAllPopulatedInTable('periods', allPopulatedTable)
        const ou = isAllPopulatedInTable('orgUnits', allPopulatedTable)
        expect(pe).toBe(true)
        expect(ou).toBe(true)
    })

    it('correctly ignores non-data cells and data cells with no item', () => {
        const pe = isAllPopulatedInTable('periods', allIgnoredCellsTable)
        expect(pe).toBe(true)
    })

    it('correctly identifies tables without all params populated', () => {
        const pe = isAllPopulatedInTable('periods', notAllPopulatedTable)
        const ou = isAllPopulatedInTable('orgUnits', notAllPopulatedTable)
        expect(pe).toBe(false)
        expect(ou).toBe(false)
    })
})
