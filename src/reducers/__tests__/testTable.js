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

export default testTable
