import {
    apiFetchAlternatives,
    apiFetchGroups,
    apiFetchDimensions,
    fetchGroups,
    fetchAlternatives,
} from '../dimensions'

let mockD2
let mockGetFn
let dimensionProps

const checkMatches = (url, matches) => {
    matches.forEach(match => {
        if (match.not) {
            expect(url).not.toMatch(match.regex)
        } else {
            expect(url).toMatch(match.regex)
        }
    })
}

const asyncCheckMatches = (matches, done) => {
    setTimeout(() => {
        expect(mockGetFn).toHaveBeenCalledTimes(1)
        const url = mockGetFn.mock.calls[0][0]

        checkMatches(url, matches)
        done()
    })
}

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
    // Includes many dummy query results for all resources to test successful parsing by `selectFromRsesponse`
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
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

describe('api: dimensions', () => {
    beforeEach(() => {
        mockGetFn = jest.fn().mockResolvedValue({ pager: {} })
        mockD2 = { Api: { getApi: () => ({ get: mockGetFn }) } }
    })

    describe.skip('apiFetchDimensions', () => {
        it('has correct entity and name property', done => {
            apiFetchDimensions(mockD2, 'entireName')

            asyncCheckMatches(
                [
                    { regex: /\/dimensions\?/ },
                    { regex: /entireName~rename\(name\)/ },
                ],
                done
            )
        })
    })

    describe('apiFetchGroups', () => {
        beforeEach(() => {
            dimensionProps = {
                groupDetail: '',
                nameProp: 'entireName',
                groupId: 'ALL',
                page: 1,
            }
        })

        it('has correct endpoint, name prop, and page value for indicators', done => {
            apiFetchGroups(mockD2, 'indicators', 'entireName')

            const matches = [
                { regex: /\/indicatorGroups\?/ },
                { regex: /displayName~rename\(name\)/ },
                { regex: /paging=false/ },
            ]

            asyncCheckMatches(matches, done)
        })

        it('has correct name prop for dataElements', done => {
            apiFetchGroups(mockD2, 'dataElements', 'entireName')

            const matches = [
                { regex: /\/dataElementGroups\?/ },
                { regex: /entireName~rename\(name\)/ },
            ]

            asyncCheckMatches(matches, done)
        })

        it('does not make an api request for dataSets', done => {
            apiFetchGroups(mockD2, 'dataSets')

            setTimeout(() => {
                expect(mockGetFn).not.toHaveBeenCalled()
                done()
            })
        })
    })

    describe('apiFetchAlternatives', () => {
        beforeEach(() => {
            dimensionProps = {
                d2: mockD2,
                groupDetail: '',
                nameProp: 'entireName',
                groupId: 'ALL',
                page: 1,
            }
        })

        describe('indicators url', () => {
            beforeEach(() => {
                dimensionProps.dataType = 'indicators'
            })

            it('has correct name, filter and page value', done => {
                apiFetchAlternatives(dimensionProps)

                const matches = [
                    { regex: /\/indicators\?/ },
                    { regex: /entireName~rename\(name\)/ },
                    { regex: /filter/, not: true },
                    { regex: /page=1/ },
                ]
                asyncCheckMatches(matches, done)
            })

            it('has correct filter text value', done => {
                dimensionProps.filterText = 'rarity'

                apiFetchAlternatives(dimensionProps)

                asyncCheckMatches(
                    [{ regex: /filter=entireName:ilike:rarity/ }],
                    done
                )
            })

            it('has correct filter based on group Id', done => {
                dimensionProps.groupId = 'rarity'

                apiFetchAlternatives(dimensionProps)

                asyncCheckMatches(
                    [{ regex: /filter=indicatorGroups\.id:eq:rarity/ }],
                    done
                )
            })
        })

        describe('dataElements url', () => {
            beforeEach(() => {
                dimensionProps.dataType = 'dataElements'
            })

            describe('totals', () => {
                it('has correct fields, filter, and page', done => {
                    apiFetchAlternatives(dimensionProps)

                    const matches = [
                        { regex: /\/dataElements\?/ },
                        { regex: /fields=id,entireName~rename\(name\)/ },
                        { regex: /filter=domainType:eq:AGGREGATE/ },
                        { regex: /filter=dataElementGroups/, not: true },
                        { regex: /page=1/ },
                    ]
                    asyncCheckMatches(matches, done)
                })

                it('has correct filter text value', done => {
                    dimensionProps.filterText = 'rarity'

                    apiFetchAlternatives(dimensionProps)

                    asyncCheckMatches(
                        [{ regex: /filter=entireName:ilike:rarity/ }],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    dimensionProps.groupId = 'rarity'

                    apiFetchAlternatives(dimensionProps)

                    asyncCheckMatches(
                        [{ regex: /filter=dataElementGroups\.id:eq:rarity/ }],
                        done
                    )
                })
            })

            describe('details', () => {
                beforeEach(() => {
                    dimensionProps.groupDetail = 'detail'
                })

                it('has correct fields, filter, and page', done => {
                    apiFetchAlternatives(dimensionProps)

                    const matches = [
                        { regex: /\/dataElementOperands\?/ },
                        { regex: /fields=id,entireName~rename\(name\)/ },
                        { regex: /filter/, not: true },
                        { regex: /page=1/ },
                    ]
                    asyncCheckMatches(matches, done)
                })

                it('has correct filter text value', done => {
                    dimensionProps.filterText = 'rarity'

                    apiFetchAlternatives(dimensionProps)

                    asyncCheckMatches(
                        [{ regex: /filter=entireName:ilike:rarity/ }],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    dimensionProps.groupId = 'rarity'

                    apiFetchAlternatives(dimensionProps)

                    asyncCheckMatches(
                        [
                            {
                                regex: /filter=dataElement\.dataElementGroups\.id:eq:rarity/,
                            },
                        ],
                        done
                    )
                })

                it('has correct url params for filterText and group Id', done => {
                    dimensionProps.filterText = 'rarity'
                    dimensionProps.groupId = 'rainbow'

                    apiFetchAlternatives(dimensionProps)

                    asyncCheckMatches(
                        [
                            { regex: /filter=entireName:ilike:rarity/ },
                            {
                                regex: /filter=dataElement\.dataElementGroups\.id:eq:rainbow/,
                            },
                        ],
                        done
                    )
                })
            })
        })

        describe('dataSets url', () => {
            beforeEach(() => {
                dimensionProps.dataType = 'dataSets'
            })

            it('has correct fields, filter, and page', done => {
                apiFetchAlternatives(dimensionProps)

                const matches = [
                    { regex: /\/dataSets\?/ },
                    { regex: /entireName~rename\(name\)/ },
                    { regex: /filter/, not: true },
                    { regex: /page=1/ },
                ]
                asyncCheckMatches(matches, done)
            })

            it('has correct filter text value', done => {
                dimensionProps.filterText = 'rarity'

                apiFetchAlternatives(dimensionProps)

                asyncCheckMatches(
                    [{ regex: /filter=entireName:ilike:rarity/ }],
                    done
                )
            })
        })

        describe('eventDataItems', () => {
            beforeEach(() => {
                dimensionProps.dataType = 'eventDataItems'
                mockGetFn = jest.fn().mockImplementation(url => {
                    if (url.includes('programDataElements')) {
                        return Promise.resolve({
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
                        })
                    } else if (url.includes('programs/')) {
                        return Promise.resolve({
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
                        })
                    }

                    return Promise.resolve({ pager: {} })
                })
            })

            it('returns the correct dimension items', done => {
                dimensionProps.groupId = 'rainbowdash'

                const expectedResult = {
                    dimensionItems: [
                        {
                            id: 'cc',
                            name: 'Chocolate cake',
                            valueType: 'NUMBER',
                        },
                        {
                            id: 'rainbowdash.broc',
                            name: 'Veggies Broccoli',
                            valueType: 'NUMBER',
                        },
                    ],
                    nextPage: null,
                }

                setTimeout(() => {
                    expect(
                        apiFetchAlternatives(dimensionProps)
                    ).resolves.toEqual(expectedResult)

                    done()
                })
            })

            it('has correct fields, filter, and page (data elements) in request url', done => {
                dimensionProps.groupId = 'rainbowdash'

                const matches = [
                    { regex: /\/programDataElements\?/ },
                    { regex: /entireName~rename\(name\)/ },
                    { regex: /filter/, not: true },
                    { regex: /page=1/ },
                    { regex: /program=rainbowdash/ },
                ]
                apiFetchAlternatives(dimensionProps)

                setTimeout(() => {
                    expect(mockGetFn).toHaveBeenCalledTimes(2)
                    const url = mockGetFn.mock.calls[0][0]

                    checkMatches(url, matches)
                    done()
                })
            })

            it('has correct filter text value in request url', done => {
                dimensionProps.filterText = 'rarity'

                const matches = [{ regex: /filter=entireName:ilike:rarity/ }]
                apiFetchAlternatives(dimensionProps)

                setTimeout(() => {
                    expect(mockGetFn).toHaveBeenCalledTimes(2)
                    const url = mockGetFn.mock.calls[0][0]

                    checkMatches(url, matches)
                    done()
                })
            })

            it('has correct fields and filter (attributes) in request url', done => {
                dimensionProps.groupId = 'rainbowdash'
                apiFetchAlternatives(dimensionProps)

                const matches = [
                    { regex: /\/programs\/rainbowdash/ },
                    { regex: /entireName~rename\(name\)/ },
                    { regex: /filter/, not: true },
                ]
                setTimeout(() => {
                    expect(mockGetFn).toHaveBeenCalledTimes(2)
                    const url = mockGetFn.mock.calls[1][0]

                    checkMatches(url, matches)
                    done()
                })
            })
        })

        describe('programIndicators url', () => {
            beforeEach(() => {
                dimensionProps.dataType = 'programIndicators'
            })

            it('has correct fields, filter, and page', done => {
                dimensionProps.groupId = 'rainbowdash'
                apiFetchAlternatives(dimensionProps)

                const matches = [
                    { regex: /\/programIndicators\?/ },
                    { regex: /entireName~rename\(name\)/ },
                    { regex: /page=1/ },
                    { regex: /filter=program.id:eq:rainbowdash/ },
                ]
                asyncCheckMatches(matches, done)
            })

            it('has correct filter text value', done => {
                dimensionProps.filterText = 'rarity'
                apiFetchAlternatives(dimensionProps)

                asyncCheckMatches(
                    [{ regex: /filter=entireName:ilike:rarity/ }],
                    done
                )
            })
        })
    })
})
