import { fetchGroups, fetchAlternatives, fetchDimensions } from '../dimensions'

// Dummy query results for all resources to test successful parsing by `selectFromResponse()`
const expectedQueryResults = {
    indicators: ['indicators!'],
    dataElements: ['dataElements!'],
    dataElementOperands: ['dataElementOperands!'],
    dataSets: ['dataSets!'],
    programDataElements: ['programDataElements!'],
    programIndicators: ['programIndicators!'],
    indicatorGroups: ['indicatorGroups'],
}

const mockQueryFn = jest.fn().mockResolvedValue({
    result: {
        pager: { page: 1, nextPage: true },
        ...expectedQueryResults,
    },
})
const mockEngine = { query: mockQueryFn }

beforeEach(() => {
    mockQueryFn.mockClear()
})

describe('fetchGroups', () => {
    it('indicators: fetches correct resource with correct fields, displayName prop, order, and paging, and correctly parses the result', async () => {
        const result = await fetchGroups(
            mockEngine,
            'indicators',
            'displayNameProp-iShouldBeOverwritten'
        )
        expect(result).toEqual(expectedQueryResults.indicatorGroups)

        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'indicatorGroups',
                params: {
                    fields: ['id', 'displayName~rename(name)'],
                    order: 'displayName:asc',
                },
            },
        })
    })

    it('dataElements: correct resource and displayName prop', async () => {
        await fetchGroups(mockEngine, 'dataElements', 'testDisplayNameProp')

        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'dataElementGroups',
                params: {
                    fields: ['id', 'testDisplayNameProp~rename(name)'],
                    order: 'testDisplayNameProp:asc',
                    paging: false,
                },
            },
        })
    })

    it("dataSets: doesn't fire a query", async () => {
        await fetchGroups(mockEngine, 'dataSets', 'displayName')

        expect(mockQueryFn).not.toHaveBeenCalled()
    })
})

describe('fetchAlternatives', () => {
    let dimensionProps

    beforeEach(() => {
        dimensionProps = {
            engine: mockEngine,
            groupDetail: '',
            nameProp: 'entireName',
            groupId: 'ALL',
            page: 1,
        }
    })

    describe('indicators', () => {
        beforeEach(() => {
            dimensionProps.dataType = 'indicators'
        })

        it('uses correct resource, fields, order, filter, and page values for query', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn).toHaveBeenCalled()
            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'indicators',
                    params: {
                        fields: [
                            'id',
                            'entireName~rename(name)',
                            'dimensionItemType',
                        ],
                        order: 'entireName:asc',
                        page: 1,
                        paging: true,
                    },
                },
            })
        })

        it('uses correct filter values based on filterText and groupId', async () => {
            await fetchAlternatives({
                ...dimensionProps,
                filterText: 'testText',
                groupId: 'testId',
            })

            expect(mockQueryFn.mock.calls[0][0].result.params.filter).toEqual([
                'indicatorGroups.id:eq:testId',
                'entireName:ilike:testText',
            ])
        })

        it('correctly parses values from response', async () => {
            const response = await fetchAlternatives(dimensionProps)

            expect(response.dimensionItems).toEqual(
                expectedQueryResults.indicators
            )
            expect(response.nextPage).toBe(2)
        })
    })

    describe('dataElements', () => {
        beforeEach(() => {
            dimensionProps.dataType = 'dataElements'
        })

        describe('Totals', () => {
            it('uses correct resource, fields, order, filter, and page values in query', async () => {
                await fetchAlternatives(dimensionProps)

                expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                    result: {
                        resource: 'dataElements',
                        params: {
                            fields: ['id', 'entireName~rename(name)'],
                            order: 'entireName:asc',
                            filter: ['domainType:eq:AGGREGATE'],
                            page: 1,
                            paging: true,
                        },
                    },
                })
            })

            it('uses correct filter value based on groupId and filterText', async () => {
                await fetchAlternatives({
                    ...dimensionProps,
                    groupId: 'testGroupId',
                    filterText: 'testFilterText',
                })

                const queryArgs = mockQueryFn.mock.calls[0][0]
                expect(queryArgs.result.params.filter).toEqual([
                    'domainType:eq:AGGREGATE',
                    'dataElementGroups.id:eq:testGroupId',
                    'entireName:ilike:testFilterText',
                ])
            })

            it('correctly parses data from results', async () => {
                const result = await fetchAlternatives(dimensionProps)

                expect(result.dimensionItems).toEqual(
                    expectedQueryResults.dataElements
                )
                expect(result.nextPage).toBe(2)
            })
        })

        describe('Details', () => {
            beforeEach(() => {
                dimensionProps.groupDetail = 'detail'
            })

            it('uses correct resource, fields, filter, order, and page values for query', async () => {
                await fetchAlternatives(dimensionProps)

                expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                    result: {
                        resource: 'dataElementOperands',
                        params: {
                            fields: ['id', 'entireName~rename(name)'],
                            order: 'entireName:asc',
                            filter: [],
                            page: 1,
                            paging: true,
                        },
                    },
                })
            })

            it('uses correct filter value based on groupId and filterText', async () => {
                await fetchAlternatives({
                    ...dimensionProps,
                    groupId: 'testGroupId',
                    filterText: 'testFilterText',
                })

                const queryArgs = mockQueryFn.mock.calls[0][0]
                expect(queryArgs.result.params.filter).toEqual([
                    'dataElement.dataElementGroups.id:eq:testGroupId',
                    'entireName:ilike:testFilterText',
                ])
            })

            it('correctly parses data from results', async () => {
                const result = await fetchAlternatives(dimensionProps)

                expect(result.dimensionItems).toEqual(
                    expectedQueryResults.dataElementOperands
                )
                expect(result.nextPage).toBe(2)
            })
        })
    })

    describe('dataSets', () => {
        beforeEach(() => {
            dimensionProps.dataType = 'dataSets'
        })

        it('uses correct resource, fields, order, filter, and page values in query', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'dataSets',
                    params: {
                        fields: [
                            'dimensionItem~rename(id)',
                            'entireName~rename(name)',
                        ],
                        order: 'entireName:asc',
                        filter: [],
                        page: 1,
                        paging: true,
                    },
                },
            })
        })

        it('uses correct filter value based on filterText', async () => {
            await fetchAlternatives({
                ...dimensionProps,
                filterText: 'testFilterText',
            })

            const queryArgs = mockQueryFn.mock.calls[0][0]
            expect(queryArgs.result.params.filter).toEqual([
                'entireName:ilike:testFilterText',
            ])
        })

        it('correctly parses data from results', async () => {
            const result = await fetchAlternatives(dimensionProps)

            expect(result.dimensionItems).toEqual(expectedQueryResults.dataSets)
            expect(result.nextPage).toBe(2)
        })
    })

    describe('eventDataItems', () => {
        let eventDataMockQuery, eventDataMockEngine

        beforeEach(() => {
            dimensionProps.dataType = 'eventDataItems'
            dimensionProps.groupId = 'testGroupId'
            eventDataMockQuery = jest.fn().mockImplementation(({ result }) => {
                if (result.resource.includes('programDataElements')) {
                    return Promise.resolve({
                        result: {
                            programDataElements: [
                                {
                                    id: 'cc',
                                    name: 'Chocolate cake',
                                    valueType: 'NUMBER',
                                },
                                {
                                    id: 'em',
                                    name: 'English muffin',
                                    valueType: 'TEXT',
                                },
                            ],
                            pager: {},
                        },
                    })
                } else if (result.resource.includes('programs/')) {
                    return Promise.resolve({
                        result: {
                            name: 'Veggies',
                            programTrackedEntityAttributes: [
                                {
                                    trackedEntityAttribute: {
                                        id: 'spin',
                                        name: 'Spinach',
                                        valueType: 'TEXT',
                                    },
                                },
                                {
                                    trackedEntityAttribute: {
                                        id: 'broc',
                                        name: 'Broccoli',
                                        valueType: 'NUMBER',
                                    },
                                },
                            ],
                        },
                    })
                }

                return Promise.resolve({ pager: {} })
            })
            eventDataMockEngine = { query: eventDataMockQuery }
        })

        it('returns the correct dimension items', async () => {
            const result = await fetchAlternatives({
                ...dimensionProps,
                engine: eventDataMockEngine,
            })
            const expectedResult = {
                dimensionItems: [
                    { id: 'cc', name: 'Chocolate cake', valueType: 'NUMBER' },
                    {
                        id: 'testGroupId.broc',
                        name: 'Veggies Broccoli',
                        valueType: 'NUMBER',
                    },
                ],
            }

            expect(result).toMatchObject(expectedResult)
        })

        it('executes two queries: one for programDataElements, one for attributes (programs/{groupId})', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn).toHaveBeenCalledTimes(2)

            const firstArgs = mockQueryFn.mock.calls[0][0]
            const secondArgs = mockQueryFn.mock.calls[1][0]
            expect(firstArgs.result.resource).toBe('programDataElements')
            expect(secondArgs.result.resource).toBe('programs/testGroupId')
        })

        it('uses correct resource, fields, order, program, filter, and page values for programDataElements query', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'programDataElements',
                    params: {
                        fields: [
                            'dimensionItem~rename(id)',
                            'entireName~rename(name)',
                            'valueType',
                        ],
                        order: 'entireName:asc',
                        program: 'testGroupId',
                        filter: [],
                        page: 1,
                    },
                },
            })
        })

        it('uses correct resource, fields, filter, and paging values for attributes (programs/{groupId}) query', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn.mock.calls[1][0]).toMatchObject({
                result: {
                    resource: 'programs/testGroupId',
                    params: {
                        fields: [
                            'entireName~rename(name)',
                            'programTrackedEntityAttributes[trackedEntityAttribute[id,entireName~rename(name),valueType]]',
                        ],
                        filter: [],
                        paging: false,
                    },
                },
            })
        })

        it('uses correct filter values based on filterText for both queries', async () => {
            await fetchAlternatives({
                ...dimensionProps,
                filterText: 'testFilterText',
            })

            const firstArgs = mockQueryFn.mock.calls[0][0]
            const secondArgs = mockQueryFn.mock.calls[1][0]
            expect(firstArgs.result.params.filter).toEqual([
                'entireName:ilike:testFilterText',
            ])
            expect(secondArgs.result.params.filter).toEqual([
                'entireName:ilike:testFilterText',
            ])
        })
    })

    describe('programIndicators', () => {
        beforeEach(() => {
            dimensionProps.dataType = 'programIndicators'
            dimensionProps.groupId = 'testGroupId'
        })

        it('uses correct resource, fields, order, filter, and page values in query', async () => {
            await fetchAlternatives(dimensionProps)

            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'programIndicators',
                    params: {
                        fields: [
                            'dimensionItem~rename(id)',
                            'entireName~rename(name)',
                        ],
                        order: 'entireName:asc',
                        filter: ['program.id:eq:testGroupId'],
                        page: 1,
                        paging: true,
                    },
                },
            })
        })

        it('uses correct filter value based on filterText', async () => {
            await fetchAlternatives({
                ...dimensionProps,
                filterText: 'testFilterText',
            })

            expect(mockQueryFn.mock.calls[0][0].result.params.filter).toEqual([
                'program.id:eq:testGroupId',
                'entireName:ilike:testFilterText',
            ])
        })

        it('correctly parses values from result', async () => {
            const result = await fetchAlternatives(dimensionProps)

            expect(result.dimensionItems).toEqual(
                expectedQueryResults.programIndicators
            )
            expect(result.nextPage).toBe(2)
        })
    })
})

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// The following test and its helper functions can be used for a future implementation of apiFetchDimension using the new data engine

describe('apiFetchDimensions', () => {
    it('uses correct resource and params values for query', async () => {
        await fetchDimensions(mockEngine, 'entireName')

        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'dimensions',
                params: {
                    fields: [
                        'id',
                        'entireName~rename(name)',
                        'dimensionType',
                        'dataDimensionType',
                    ],
                    order: 'entireName:asc',
                    paging: false,
                },
            },
        })
    })
})
