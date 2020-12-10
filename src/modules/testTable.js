import { defaultCell } from './defaultTable'

export const testTable = {
    columns: [{ name: 'Column 0' }, { name: 'Column 1' }, { name: 'Column 2' }],
    rows: [
        {
            name: 'Row 0',
            cells: [
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 0', id: 'ID 0' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 1', id: 'ID 1' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 2', id: 'ID 2' },
                    },
                },
            ],
        },
        {
            name: 'Row 1',
            cells: [
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 3', id: 'ID 3' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 4', id: 'ID 4' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 5', id: 'ID 5' },
                    },
                },
            ],
        },
        {
            name: 'Row 2',
            cells: [
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 6', id: 'ID 6' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 7', id: 'ID 7' },
                    },
                },
                {
                    ...defaultCell,
                    data: {
                        ...defaultCell.data,
                        item: { name: 'Cell 8', id: 'ID 8' },
                    },
                },
            ],
        },
    ],
}
