import path from 'path'

export const TABLES = '/tables'
export const EDIT_TABLE = '/tables/edit'
export const GENERATED_TABLE = '/tables/generated'

export const HELP =
    'https://github.com/KaiVandivier/custom-report-builder/blob/master/docs/tables.md'

export const REPORTS = '/reports'

export const getPath = (...args) => path.join(...args)
