import tableReducer, {
    ADD_ROW,
    UPDATE_ROW,
    REORDER_ROW,
    DELETE_ROW,
    ADD_COLUMN,
    UPDATE_COLUMN,
    REORDER_COLUMN,
    DELETE_COLUMN,
    UPDATE_CELL,
} from '../tableReducer'

const testCell = {
    item: { name: 'Test Item', id: 'Test ID' },
    dataType: 'indicators',
    groupId: 'ALL',
    groupDetail: '',
}

export const testTable = {
    columns: [{ name: 'Column 0' }, { name: 'Column 1' }, { name: 'Column 2' }],
    rows: [
        {
            name: 'Row 0',
            cells: [
                { ...testCell, item: { name: 'Cell 0', id: 'ID 0' } },
                { ...testCell, item: { name: 'Cell 1', id: 'ID 1' } },
                { ...testCell, item: { name: 'Cell 2', id: 'ID 2' } },
            ],
        },
        {
            name: 'Row 1',
            cells: [
                { ...testCell, item: { name: 'Cell 3', id: 'ID 3' } },
                { ...testCell, item: { name: 'Cell 4', id: 'ID 4' } },
                { ...testCell, item: { name: 'Cell 5', id: 'ID 5' } },
            ],
        },
        {
            name: 'Row 2',
            cells: [
                { ...testCell, item: { name: 'Cell 6', id: 'ID 6' } },
                { ...testCell, item: { name: 'Cell 7', id: 'ID 7' } },
                { ...testCell, item: { name: 'Cell 8', id: 'ID 8' } },
            ],
        },
    ],
}

describe('no action given', () => {
    it('returns state', () => {
        const res = tableReducer(testTable, { type: 'invalid type' })
        expect(res).toEqual(testTable)
    })
})

describe('row actions', () => {
    it('adds a row', () => {
        const res = tableReducer(testTable, {
            type: ADD_ROW,
            payload: { name: 'New row' },
        })
        expect(res.rows).toHaveLength(4)
        expect(res.rows[3].name).toBe('New row')
        expect(res.rows[3].cells).toHaveLength(3)
    })

    it('updates a row', () => {
        const res = tableReducer(testTable, {
            type: UPDATE_ROW,
            payload: { idx: 0, row: { name: 'Updated row' } },
        })
        expect(res.rows).toHaveLength(3)
        expect(res.rows[0].name).toBe('Updated row')
        expect(res.rows[0].cells).toEqual(testTable.rows[0].cells)
    })

    it('reorders a row', () => {
        const res = tableReducer(testTable, {
            type: REORDER_ROW,
            payload: { oldIdx: 0, newIdx: 1 },
        })
        expect(res.rows[0].name).toBe('Row 1')
        expect(res.rows[1].name).toBe('Row 0')
    })

    it('deletes a row', () => {
        const res = tableReducer(testTable, {
            type: DELETE_ROW,
            payload: { idx: 2 },
        })
        expect(res.rows).toHaveLength(2)
        expect(res.rows.some(row => row.name == 'Row 2')).toBe(false)
    })
})

describe('column actions', () => {
    it('adds a column and adds new cells to each row', () => {
        // Huh, not working
        const res = tableReducer(testTable, {
            type: ADD_COLUMN,
            payload: { name: 'New column' },
        })
        expect(res.columns).toHaveLength(4)
        expect(res.rows[0].cells).toHaveLength(4)
        expect(res.columns[3].name).toBe('New column')
    })

    it('updates a column', () => {
        const res = tableReducer(testTable, {
            type: UPDATE_COLUMN,
            payload: { idx: 0, column: { name: 'Updated column' } },
        })
        expect(res.columns[0].name).toBe('Updated column')
    })

    it('reorders a column and all the appropriate cells in rows', () => {
        const res = tableReducer(testTable, {
            type: REORDER_COLUMN,
            payload: { oldIdx: 0, newIdx: 1 },
        })
        expect(res.columns[0]).toEqual(testTable.columns[1])
        expect(res.columns[1]).toEqual(testTable.columns[0])

        expect(res.rows[0].cells[0]).toEqual(testTable.rows[0].cells[1])
        expect(res.rows[0].cells[1]).toEqual(testTable.rows[0].cells[0])
    })

    it('deletes a column and the appropriate cells in rows', () => {
        const res = tableReducer(testTable, {
            type: DELETE_COLUMN,
            payload: { idx: 0 },
        })
        expect(res.columns).toEqual(testTable.columns.slice(1))
        expect(res.rows[0].cells).toEqual(testTable.rows[0].cells.slice(1))
    })
})

describe('cell actions', () => {
    it('updates a cell with given values', () => {
        const newCell = {
            item: { name: 'New cell data', id: 'New cell' },
            dataType: 'programIndicators',
            groupId: '1234567890',
            groupDetail: '',
        }
        const res = tableReducer(testTable, {
            type: UPDATE_CELL,
            payload: { rowIdx: 0, cellIdx: 0, cell: { ...newCell } },
        })
        expect(res.rows[0].cells[0]).toEqual(newCell)
    })
})
