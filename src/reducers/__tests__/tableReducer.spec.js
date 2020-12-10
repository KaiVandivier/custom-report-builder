import tableReducer, {
    UPDATE_TABLE,
    ADD_ROW,
    UPDATE_ROW,
    REORDER_ROW,
    DELETE_ROW,
    ADD_COLUMN,
    UPDATE_COLUMN,
    REORDER_COLUMN,
    DELETE_COLUMN,
    UPDATE_CELL,
    UPDATE_ROW_DIMENSIONS,
    UPDATE_COLUMN_DIMENSIONS,
    UPDATE_ROW_HIGHLIGHTING,
    UPDATE_COLUMN_HIGHLIGHTING,
} from '../tableReducer'
import { testTable } from '../../modules/testTable'
import { defaultCell } from '../../modules/defaultTable'

describe('no action given', () => {
    it('returns state', () => {
        const res = tableReducer(testTable, { type: 'invalid type' })
        expect(res).toEqual(testTable)
    })
})

it('updates the table', () => {
    const res = tableReducer(testTable, {
        type: UPDATE_TABLE,
        payload: { highlightingOn: true },
    })
    expect(res.highlightingOn).toBe(true)
})

describe('row actions', () => {
    describe('adding rows', () => {
        it('adds a row', () => {
            const res = tableReducer(testTable, {
                type: ADD_ROW,
                payload: { name: 'New row' },
            })
            expect(res.rows).toHaveLength(4)
            expect(res.rows[3].name).toBe('New row')
            expect(res.rows[3].cells).toHaveLength(3)
        })

        it('applies values from dimensions defined on columns to data values on new cells', () => {
            const testDimensions = {
                orgUnits: [{ id: 'testOrgUnit', name: 'Test Org Unit' }],
                periods: [{ id: 'testPeriod', name: 'Test Period' }],
                item: { id: 'testItem', name: 'Test Item' },
            }
            const testCol = {
                name: 'test Col',
                dimensions: testDimensions,
            }
            const dimensionTestTable = {
                ...testTable,
                columns: [testCol, ...testTable.columns],
            }

            const res = tableReducer(dimensionTestTable, {
                type: ADD_ROW,
                payload: { name: 'New row' },
            })

            const newRow = res.rows[res.rows.length - 1]
            expect(newRow.cells[0].data).toMatchObject(testDimensions)
        })

        it('applies highlighting configuration from columns to new cells', () => {
            const testIntervals = [{ text: 'test interval' }]
            const testCol = {
                name: 'test col',
                highlightingIntervals: testIntervals,
            }
            const highlightingTestTable = {
                ...testTable,
                columns: [testCol, ...testTable.columns],
            }

            const res = tableReducer(highlightingTestTable, {
                type: ADD_ROW,
                payload: { name: 'New row' },
            })

            const newRow = res.rows[res.rows.length - 1]
            expect(newRow.cells[0].highlightingIntervals).toEqual(testIntervals)
        })
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

    it('updates row dimensions (and cell data)', () => {
        const dimensions = {
            orgUnits: [{ id: 'fakeID', name: 'Test orgUnit' }],
        }
        const res = tableReducer(testTable, {
            type: UPDATE_ROW_DIMENSIONS,
            payload: {
                idx: 0,
                dimensions,
            },
        })
        expect(res.rows[0].dimensions).toMatchObject(dimensions)
        res.rows[0].cells.forEach(cell => {
            expect(cell.data).toMatchObject(dimensions)
        })
    })

    describe('row highlighting', () => {
        it('updates row highlighting (and on all cells in row)', () => {
            const intervals = [{ text: 'test interval' }]
            const res = tableReducer(testTable, {
                type: UPDATE_ROW_HIGHLIGHTING,
                payload: { idx: 0, highlightingIntervals: intervals },
            })

            expect(res.rows[0].highlightingIntervals).toEqual(intervals)
            const allCellsHaveNewIntervals = res.rows[0].cells.every(
                cell => cell.highlightingIntervals == intervals
            )
            expect(allCellsHaveNewIntervals).toBe(true)
        })

        describe('clearing row highlighting', () => {
            it('it clears row highlighting when highlighting is not defined on columns', () => {
                const intervals = [{ text: 'test interval' }]
                // add highlighting
                const highlightedTable = tableReducer(testTable, {
                    type: UPDATE_ROW_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: intervals },
                })
                const res = tableReducer(highlightedTable, {
                    type: UPDATE_ROW_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: null },
                })

                expect(res.rows[0].highlightingIntervals).toEqual(null)
                const allCellsCleared = res.rows[0].cells.every(
                    cell => cell.highlightingIntervals === null
                )
                expect(allCellsCleared).toBe(true)
            })

            it('uses column highlighting config on cells in columns with highlighting defined', () => {
                const rowIntervals = [{ text: 'row interval' }]
                const colIntervals = [{ text: 'col interval' }]
                // add highlighting tow row and col
                const colHighlightedTable = tableReducer(testTable, {
                    type: UPDATE_COLUMN_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: colIntervals },
                })
                const rowHighlightedTable = tableReducer(colHighlightedTable, {
                    type: UPDATE_ROW_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: rowIntervals },
                })
                // clear highlighting on just col
                const res = tableReducer(rowHighlightedTable, {
                    type: UPDATE_ROW_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: null },
                })

                expect(res.rows[0].highlightingIntervals).toEqual(null)
                expect(res.rows[0].cells[0].highlightingIntervals).toEqual(
                    colIntervals
                )
            })
        })
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
    describe('adding columns', () => {
        it('adds a column and adds new cells to each row', () => {
            const res = tableReducer(testTable, {
                type: ADD_COLUMN,
                payload: { name: 'New column' },
            })
            expect(res.columns).toHaveLength(4)
            expect(res.rows[0].cells).toHaveLength(4)
            expect(res.columns[3].name).toBe('New column')
        })

        it('applies values from dimensions defined on rows to data values on new cells', () => {
            const testDimensions = {
                orgUnits: [{ id: 'testOrgUnit', name: 'Test Org Unit' }],
                periods: [{ id: 'testPeriod', name: 'Test Period' }],
                item: { id: 'testItem', name: 'Test Item' },
            }
            const testRow = {
                name: 'test row',
                dimensions: testDimensions,
                cells: Array(testTable.columns.length).fill(defaultCell),
            }
            const dimensionTestTable = {
                ...testTable,
                rows: [testRow, ...testTable.rows],
            }
            const res = tableReducer(dimensionTestTable, {
                type: ADD_COLUMN,
                payload: { name: 'New column' },
            })
            const newlyAddedCell =
                res.rows[0].cells[res.rows[0].cells.length - 1]
            expect(newlyAddedCell.data).toMatchObject(testDimensions)
        })

        it('applies highlighting configuration from columns to new cells', () => {
            const testIntervals = [{ text: 'test interval' }]
            const testRow = {
                name: 'test row',
                highlightingIntervals: testIntervals,
                cells: Array(testTable.columns.length).fill(defaultCell),
            }
            const highlightingTestTable = {
                ...testTable,
                rows: [testRow, ...testTable.rows],
            }

            const res = tableReducer(highlightingTestTable, {
                type: ADD_COLUMN,
                payload: { name: 'New col' },
            })

            const newCell = res.rows[0].cells[res.rows[0].cells.length - 1]
            expect(newCell.highlightingIntervals).toEqual(testIntervals)
        })
    })

    it('updates a column', () => {
        const res = tableReducer(testTable, {
            type: UPDATE_COLUMN,
            payload: { idx: 0, column: { name: 'Updated column' } },
        })
        expect(res.columns[0].name).toBe('Updated column')
    })

    it('updates column dimensions (and cell data)', () => {
        const idx = 2
        const dimensions = {
            periods: [{ id: 'THIS_MONTH', name: 'This month' }],
            item: { id: '1234', name: 'Test data' },
        }
        const res = tableReducer(testTable, {
            type: UPDATE_COLUMN_DIMENSIONS,
            payload: {
                idx,
                dimensions,
            },
        })
        expect(res.columns[idx].dimensions).toMatchObject(dimensions)
        res.rows.forEach(row => {
            expect(row.cells[idx].data).toMatchObject(dimensions)
        })
    })

    describe('column highlighting', () => {
        it('updates column highlighting (and for all cells in column)', () => {
            const intervals = [{ text: 'test interval' }]
            const res = tableReducer(testTable, {
                type: UPDATE_COLUMN_HIGHLIGHTING,
                payload: { idx: 0, highlightingIntervals: intervals },
            })

            expect(res.columns[0].highlightingIntervals).toEqual(intervals)
            const allCellsHaveNewIntervals = res.rows.every(
                row => row.cells[0].highlightingIntervals == intervals
            )
            expect(allCellsHaveNewIntervals).toBe(true)
        })

        describe('clearing column highlighting', () => {
            it('clears highlighting on rows with no highlighting', () => {
                const intervals = [{ text: 'test interval' }]
                // add highlighting
                const highlightedTable = tableReducer(testTable, {
                    type: UPDATE_COLUMN_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: intervals },
                })
                // clear highlighting
                const res = tableReducer(highlightedTable, {
                    type: UPDATE_COLUMN_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: null },
                })

                expect(res.columns[0].highlightingIntervals).toEqual(null)
                const allCellsCleared = res.rows.every(
                    row => row.cells[0].highlightingIntervals === null
                )
                expect(allCellsCleared).toBe(true)
            })

            it('reverts highlighting to row default if defined', () => {
                const rowIntervals = [{ text: 'row interval' }]
                const colIntervals = [{ text: 'col interval' }]
                // add highlighting tow row and col
                const rowHighlightedTable = tableReducer(testTable, {
                    type: UPDATE_ROW_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: rowIntervals },
                })
                const colHighlightedTable = tableReducer(rowHighlightedTable, {
                    type: UPDATE_COLUMN_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: colIntervals },
                })
                // clear highlighting on just col
                const res = tableReducer(colHighlightedTable, {
                    type: UPDATE_COLUMN_HIGHLIGHTING,
                    payload: { idx: 0, highlightingIntervals: null },
                })

                expect(res.columns[0].highlightingIntervals).toEqual(null)
                expect(res.rows[0].cells[0].highlightingIntervals).toEqual(
                    rowIntervals
                )
            })
        })
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
        expect(res.rows[0].cells[0]).toMatchObject(newCell)
    })
})
