export const defaultCell = {
    contentType: 'data',
    data: {
        item: null,
        dataType: null,
        group: null,
        groupDetail: null,
        orgUnits: [],
        periods: [],
    },
    text: '',
}

export const defaultTable = {
    columns: [{ name: 'Column 1' }],
    rows: [
        {
            name: 'Row 1',
            cells: [defaultCell],
        },
    ],
}

export default defaultTable
