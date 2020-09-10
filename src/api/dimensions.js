import sortBy from 'lodash/sortBy'

import { onError } from './index'
import { DATA_SETS_CONSTANTS } from '../modules/dataSets'
import { CHART_AGGREGATE_AGGREGATABLE_TYPES } from '../modules/dataTypes'

// Request util
const selectFromResponse = (response, entity, selectorFn) =>
    typeof selectorFn === 'function' ? selectorFn(response) : response[entity]

// Data queries (replace requests made by d2.Api)
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

export const fetchAlternatives = args => {
    const { engine, dataType, groupDetail, ...queryParams } = args

    switch (dataType) {
        case 'indicators': {
            return fetchIndicators({ engine, ...queryParams })
        }
        case 'dataElements': {
            if (groupDetail === 'detail') {
                return fetchDataElementOperands({ engine, ...queryParams })
            } else {
                return fetchDataElements({ engine, ...queryParams })
            }
        }
        case 'dataSets': {
            return fetchDataSets({ engine, ...queryParams })
        }
        case 'eventDataItems': {
            return queryParams.groupId
                ? getEventDataItems({ engine, ...queryParams })
                : null
        }
        case 'programIndicators': {
            return queryParams.groupId
                ? fetchProgramIndicators({ engine, ...queryParams })
                : null
        }
        default:
            return null
    }
}

const fetchIndicators = ({ engine, nameProp, groupId, filterText, page }) => {
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

const fetchDataElements = ({ engine, nameProp, groupId, filterText, page }) => {
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

const fetchDataElementOperands = ({
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

const fetchDataSets = ({ engine, page, filterText, nameProp }) => {
    const fields = ['dimensionItem~rename(id)', `${nameProp}~rename(name)`]
    const order = `${nameProp}:asc`
    const filter = filterText ? [`${nameProp}:ilike:${filterText}`] : []

    return dataQueryWithPaging(engine, {
        resource: 'dataSets',
        params: { fields, order, filter, page },
    })
}

const fetchProgramDataElements = ({
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

const fetchTrackedEntityAttributes = ({
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

const getEventDataItems = async args => {
    const [dataElementsObj, attributes] = await Promise.all([
        fetchProgramDataElements(args),
        fetchTrackedEntityAttributes(args),
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

export const fetchDimensions = (engine, nameProp) => {
    const fields = [
        'id',
        `${nameProp}~rename(name)`,
        'dimensionType',
        'dataDimensionType',
    ]
    const order = `${nameProp}:asc`

    return dataQuery(engine, {
        resource: 'dimensions',
        params: { fields, order },
    })
}

// TODO: Refactor the following functions to use the data engine
// (They are unused in this project)

/* 
export const apiFetchRecommendedIds = (d2, dxIds, ouIds) => {
    let dimensions = 'dimension='

    if (dxIds.length) {
        dimensions = dimensions.concat(`dx:${dxIds.join(';')}`)

        if (ouIds.length)
            dimensions = dimensions.concat(`&dimension=ou:${ouIds.join(';')}`)
    } else if (ouIds.length) {
        dimensions = dimensions.concat(`ou:${ouIds.join(';')}`)
    } else {
        return Promise.resolve([])
    }

    const url = `/dimensions/recommendations?${dimensions}&fields=id`
    return d2.Api.getApi()
        .get(url)
        .then(response => response.dimensions.map(item => item.id))
        .catch(onError)
}

export const apiFetchItemsByDimension = (d2, dimensionId) => {
    const fields = `fields=id,displayName~rename(name)`
    const order = `order=displayName:asc`

    const url = `dimensions/${dimensionId}/items?${fields}&${order}`

    return d2.Api.getApi()
        .get(url)
        .then(response => response.items)
}
*/
