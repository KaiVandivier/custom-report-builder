import sortBy from 'lodash/sortBy'

import { onError } from './index'
import { DATA_SETS_CONSTANTS } from '../modules/dataSets'
import { CHART_AGGREGATE_AGGREGATABLE_TYPES } from '../modules/dataTypes'

// Request util functions
const selectFromResponse = (response, entity, selectorFn) =>
    typeof selectorFn === 'function' ? selectorFn(response) : response[entity]

// Request functions
const request = (d2, entity, { paramString, selectorFn } = {}) => {
    const url = `/${entity}?${paramString}&paging=false`

    return d2.Api.getApi()
        .get(url)
        .then(response => selectFromResponse(response, entity, selectorFn))
        .catch(onError)
}

const requestWithPaging = (
    d2,
    entity,
    { page, paramString, selectorFn } = {}
) => {
    const paging = `&paging=true&page=${page}`
    const url = `/${entity}?${paramString}${paging}`

    return d2.Api.getApi()
        .get(url)
        .then(response => ({
            dimensionItems: selectFromResponse(response, entity, selectorFn),
            nextPage: response.pager.nextPage ? response.pager.page + 1 : null,
        }))
        .catch(onError)
}

// Query builder (to replace requests made by d2.Api)
export const dataQuery = (engine, { resource, params, selectorFn }) => {
    return engine
        .query({ result: { resource, params: { ...params, paging: false } } })
        .then(({ result }) => selectFromResponse(result, resource, selectorFn))
        .catch(onError)
}

export const dataQueryWithPaging = (
    engine,
    { resource, params, selectorFn }
) => {
    return engine
        .query({ result: { resource, params: { ...params, paging: true } } })
        .then(({ result }) => ({
            dimensionItems: selectFromResponse(result, resource, selectorFn),
            nextPage: result.pager.nextPage ? result.pager.page + 1 : null,
        }))
        .catch(onError)
}

// Fetch functions

// export const apiFetchDimensions = (d2, nameProp) => {
//     const fields = `fields=id,${nameProp}~rename(name),dimensionType,dataDimensionType`
//     const order = `order=${nameProp}:asc`

//     const params = `${fields}&${order}`

//     return request(d2, 'dimensions', { paramString: params })
// }

// export const apiFetchRecommendedIds = (d2, dxIds, ouIds) => {
//     let dimensions = 'dimension='

//     if (dxIds.length) {
//         dimensions = dimensions.concat(`dx:${dxIds.join(';')}`)

//         if (ouIds.length)
//             dimensions = dimensions.concat(`&dimension=ou:${ouIds.join(';')}`)
//     } else if (ouIds.length) {
//         dimensions = dimensions.concat(`ou:${ouIds.join(';')}`)
//     } else {
//         return Promise.resolve([])
//     }

//     const url = `/dimensions/recommendations?${dimensions}&fields=id`
//     return d2.Api.getApi()
//         .get(url)
//         .then(response => response.dimensions.map(item => item.id))
//         .catch(onError)
// }

// export const apiFetchItemsByDimension = (d2, dimensionId) => {
//     const fields = `fields=id,displayName~rename(name)`
//     const order = `order=displayName:asc`

//     const url = `dimensions/${dimensionId}/items?${fields}&${order}`

//     return d2.Api.getApi()
//         .get(url)
//         .then(response => response.items)
// }

export const fetchGroups = (engine, dataType, nameProp) => {
    const name = dataType === 'indicators' ? 'displayName' : nameProp
    const fields = ['id', `${name}~rename(name)`]
    const order = `${name}:asc`
    const params = { fields, order }

    switch (dataType) {
        case 'indicators': {
            return dataQuery(engine, { resource: 'indicatorGroups', params })
        }
        case 'dataElements': {
            return dataQuery(engine, {
                resource: 'dataElementGroups',
                params,
            })
        }
        case 'dataSets': {
            const dataSetGroups = DATA_SETS_CONSTANTS.map(
                ({ id, getName }) => ({
                    id,
                    name: getName(),
                })
            )
            return Promise.resolve(dataSetGroups)
        }
        case 'eventDataItems':
        case 'programIndicators': {
            return dataQuery(engine, { resource: 'programs', params })
        }
        default:
            return null
    }
}

export const apiFetchGroups = (d2, dataType, nameProp) => {
    // indicatorGroups does not support shortName
    const name = dataType === 'indicators' ? 'displayName' : nameProp
    const fields = `fields=id,${name}~rename(name)`
    const order = `order=${name}:asc`

    const params = `${fields}&${order}`

    switch (dataType) {
        case 'indicators': {
            return request(d2, 'indicatorGroups', { paramString: params })
        }
        case 'dataElements': {
            return request(d2, 'dataElementGroups', { paramString: params })
        }
        case 'dataSets': {
            const dataSetGroups = DATA_SETS_CONSTANTS.map(
                ({ id, getName }) => ({
                    id,
                    name: getName(),
                })
            )
            return Promise.resolve(dataSetGroups)
        }
        case 'eventDataItems':
        case 'programIndicators': {
            return request(d2, 'programs', { paramString: params })
        }
        default:
            return null
    }
}

export const fetchAlternatives = args => {
    const { engine, dataType, groupDetail, ...queryParams } = args

    switch (dataType) {
        case 'indicators': {
            return _fetchIndicators({ engine, ...queryParams })
        }
        case 'dataElements': {
            if (groupDetail === 'detail') {
                return _fetchDataElementOperands({ engine, ...queryParams })
            } else {
                return _fetchDataElements({ engine, ...queryParams })
            }
        }
        case 'dataSets': {
            return _fetchDataSets({ engine, ...queryParams })
        }
        case 'eventDataItems': {
            return queryParams.groupId
                ? _getEventDataItems({ engine, ...queryParams })
                : null
        }
        case 'programIndicators': {
            return queryParams.groupId
                ? _fetchProgramIndicators({ engine, ...queryParams })
                : null
        }
        default:
            return null
    }
}

const _fetchIndicators = ({ engine, nameProp, groupId, filterText, page }) => {
    const fields = ['id', `${nameProp}~rename(name)`, 'dimensionItemType']

    const order = `${nameProp}:asc`

    const filter = groupId !== 'ALL' ? [`indicatorGroups.id:eq:${groupId}`] : []

    if (filterText) {
        filter.push(`${nameProp}:ilike:${filterText}`)
    }

    return dataQueryWithPaging(engine, {
        resource: 'indicators',
        params: { fields, order, filter, page },
    })
}

const _fetchDataElements = ({
    engine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
    const fields = [idField, `${nameProp}~rename(name)`]
    const order = `${nameProp}:asc`

    const filter = ['domainType:eq:AGGREGATE']
    if (groupId !== 'ALL') {
        filter.push(`dataElementGroups.id:eq:${groupId}`)
    }
    if (filterText) {
        filter.push(`${nameProp}:ilike:${filterText}`)
    }

    return dataQueryWithPaging(engine, {
        resource: 'dataElements',
        params: {
            fields,
            order,
            filter,
            page,
        },
    })
}

const _fetchDataElementOperands = ({
    engine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
    const fields = [idField, `${nameProp}~rename(name)`]
    const order = `${nameProp}:asc`

    const filter = []
    if (groupId !== 'ALL') {
        filter.push(`dataElement.dataElementGroups.id:eq:${groupId}`)
    }
    if (filterText) {
        filter.push(`${nameProp}:ilike:${filterText}`)
    }

    return dataQueryWithPaging(engine, {
        resource: 'dataElementOperands',
        params: { fields, order, filter, page },
    })
}

const _fetchDataSets = ({ engine, page, filterText, nameProp }) => {
    const fields = ['dimensionItem~rename(id)', `${nameProp}~rename(name)`]
    const order = `${nameProp}:asc`
    const filter = filterText ? [`${nameProp}:ilike:${filterText}`] : []

    return dataQueryWithPaging(engine, {
        resource: 'dataSets',
        params: { fields, order, filter, page },
    })
}

const _fetchProgramDataElements = ({
    engine,
    groupId,
    page,
    filterText,
    nameProp,
}) => {
    const fields = [
        'dimensionItem~rename(id)',
        `${nameProp}~rename(name)`,
        'valueType',
    ]
    const order = `${nameProp}:asc`
    const program = groupId
    const filter = filterText ? [`${nameProp}:ilike:${filterText}`] : []

    return dataQueryWithPaging(engine, {
        resource: 'programDataElements',
        params: { fields, order, program, filter, page },
    })
}

const _fetchTrackedEntityAttributes = ({
    engine,
    groupId,
    filterText,
    nameProp,
}) => {
    const fields = [
        `${nameProp}~rename(name)`,
        `programTrackedEntityAttributes[trackedEntityAttribute[id,${nameProp}~rename(name),valueType]]`,
    ]
    const filter = filterText ? [`${nameProp}:ilike:${filterText}`] : []
    return dataQuery(engine, {
        paging: false,
        resource: `programs/${groupId}`,
        params: { fields, filter },
        selectorFn: r =>
            Array.isArray(r.programTrackedEntityAttributes)
                ? r.programTrackedEntityAttributes
                      .map(a => a.trackedEntityAttribute)
                      .map(a => ({
                          ...a,
                          id: `${groupId}.${a.id}`,
                          name: `${r.name} ${a.name}`,
                      }))
                : [],
    })
}

const _getEventDataItems = async args => {
    const [dataElementsObj, attributes] = await Promise.all([
        _fetchProgramDataElements(args),
        _fetchTrackedEntityAttributes(args),
    ])

    const filterInvalidTypes = item =>
        Boolean(CHART_AGGREGATE_AGGREGATABLE_TYPES.includes(item.valueType))

    return {
        ...dataElementsObj,
        dimensionItems: sortBy(
            [...dataElementsObj.dimensionItems, ...attributes].filter(
                filterInvalidTypes
            ),
            'name'
        ),
    }
}

const _fetchProgramIndicators = ({
    engine,
    groupId,
    page,
    filterText,
    nameProp,
}) => {
    const fields = ['dimensionItem~rename(id)', `${nameProp}~rename(name)`]
    const order = `${nameProp}:asc`
    const filter = [`program.id:eq:${groupId}`]
    if (filterText) filter.push(`${nameProp}:ilike:${filterText}`)

    return dataQueryWithPaging(engine, {
        resource: 'programIndicators',
        params: { fields, order, filter, page },
    })
}

export const apiFetchAlternatives = args => {
    const { d2, dataType, groupDetail, ...queryParams } = args

    switch (dataType) {
        case 'indicators': {
            return fetchIndicators({ d2, ...queryParams })
        }
        case 'dataElements': {
            if (groupDetail === 'detail') {
                return fetchDataElementOperands({ d2, ...queryParams })
            } else {
                return fetchDataElements({ d2, ...queryParams })
            }
        }
        case 'dataSets': {
            return fetchDataSets({ d2, ...queryParams })
        }
        case 'eventDataItems': {
            return queryParams.groupId
                ? getEventDataItems({ d2, ...queryParams })
                : null
        }
        case 'programIndicators': {
            return queryParams.groupId
                ? fetchProgramIndicators({ d2, ...queryParams })
                : null
        }
        default:
            return null
    }
}

const fetchIndicators = ({ d2, nameProp, groupId, filterText, page }) => {
    const fields = `fields=id,${nameProp}~rename(name),dimensionItemType&order=${nameProp}:asc`
    const order = `order=${nameProp}:asc`
    let filter =
        groupId !== 'ALL' ? `&filter=indicatorGroups.id:eq:${groupId}` : ''

    if (filterText) {
        filter = filter.concat(`&filter=${nameProp}:ilike:${filterText}`)
    }

    const paramString = `${fields}&${order}${filter}`

    return requestWithPaging(d2, 'indicators', { paramString, page })
}

const fetchDataElements = ({ d2, groupId, page, filterText, nameProp }) => {
    const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
    const fields = `fields=${idField},${nameProp}~rename(name)`
    const order = `order=${nameProp}:asc`

    let filter = '&filter=domainType:eq:AGGREGATE'
    if (groupId !== 'ALL') {
        filter = filter.concat(`&filter=dataElementGroups.id:eq:${groupId}`)
    }

    if (filterText) {
        filter = filter.concat(`&filter=${nameProp}:ilike:${filterText}`)
    }

    const paramString = `${fields}&${order}${filter}`

    return requestWithPaging(d2, 'dataElements', { paramString, page })
}

const fetchDataElementOperands = ({
    d2,
    groupId,
    page,
    filterText,
    nameProp,
}) => {
    const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
    const fields = `fields=${idField},${nameProp}~rename(name)`
    const order = `order=${nameProp}:asc`

    let filter = ''
    if (groupId !== 'ALL') {
        filter = `&filter=dataElement.dataElementGroups.id:eq:${groupId}`
    }

    if (filterText) {
        const textFilter = `&filter=${nameProp}:ilike:${filterText}`
        filter = filter.length ? filter.concat(textFilter) : textFilter
    }

    return requestWithPaging(d2, 'dataElementOperands', {
        paramString: `${fields}&${order}${filter}`,
        page,
    })
}

const fetchDataSets = ({ d2, page, filterText, nameProp }) => {
    const fields = `fields=dimensionItem~rename(id),${nameProp}~rename(name)`
    const order = `order=${nameProp}:asc`
    const filter = filterText ? `&filter=${nameProp}:ilike:${filterText}` : ''

    const paramString = `${fields}&${order}${filter}`

    return requestWithPaging(d2, 'dataSets', { paramString, page })
}

const fetchProgramDataElements = ({
    d2,
    groupId,
    page,
    filterText,
    nameProp,
}) => {
    const fields = `fields=dimensionItem~rename(id),${nameProp}~rename(name),valueType`
    const order = `order=${nameProp}:asc`
    const program = `program=${groupId}`
    const filter = filterText ? `&filter=${nameProp}:ilike:${filterText}` : ''

    const paramString = `${fields}&${order}&${program}${filter}`

    return requestWithPaging(d2, 'programDataElements', { paramString, page })
}

const fetchTrackedEntityAttributes = ({
    d2,
    groupId,
    filterText,
    nameProp,
}) => {
    const fields = `fields=${nameProp}~rename(name),programTrackedEntityAttributes[trackedEntityAttribute[id,${nameProp}~rename(name),valueType]]`
    const filter = filterText ? `&filter=${nameProp}:ilike:${filterText}` : ''

    const paramString = `${fields}${filter}`

    return request(d2, `programs/${groupId}`, {
        paramString,
        selectorFn: r =>
            Array.isArray(r.programTrackedEntityAttributes)
                ? r.programTrackedEntityAttributes
                      .map(a => a.trackedEntityAttribute)
                      .map(a => ({
                          ...a,
                          id: `${groupId}.${a.id}`,
                          name: `${r.name} ${a.name}`,
                      }))
                : [],
    })
}

const getEventDataItems = async (d2, queryParams) => {
    const [dataElementsObj, attributes] = await Promise.all([
        fetchProgramDataElements(d2, queryParams),
        fetchTrackedEntityAttributes(d2, queryParams),
    ])

    const filterInvalidTypes = item =>
        Boolean(CHART_AGGREGATE_AGGREGATABLE_TYPES.includes(item.valueType))

    return {
        ...dataElementsObj,
        dimensionItems: sortBy(
            [...dataElementsObj.dimensionItems, ...attributes].filter(
                filterInvalidTypes
            ),
            'name'
        ),
    }
}

const fetchProgramIndicators = ({
    d2,
    groupId,
    page,
    filterText,
    nameProp,
}) => {
    const fields = `fields=dimensionItem~rename(id),${nameProp}~rename(name)`
    const order = `order=${nameProp}:asc`
    const programFilter = `filter=program.id:eq:${groupId}`
    const filter = filterText ? `&filter=${nameProp}:ilike:${filterText}` : ''

    const paramString = `${fields}&${order}&${programFilter}${filter}`

    return requestWithPaging(d2, 'programIndicators', { paramString, page })
}
