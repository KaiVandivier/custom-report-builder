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

describe.only('fetch groups with data query', () => {
    let mockQueryFn
    let mockEngine
    beforeEach(() => {
        // Could also be "reset mocks"
        mockQueryFn = jest.fn().mockResolvedValue({
            result: { pager: {}, indicatorGroups: { msg: 'hello!' } },
        })
        mockEngine = { query: mockQueryFn }
    })

    test('it correctly fetches indicator groups', async () => {
        const result = await fetchGroups(
            mockEngine,
            'indicators',
            'displayName'
        )
        expect(mockQueryFn).toHaveBeenCalled()
        expect(result).toMatchObject({ msg: 'hello!' })
    })
})

describe.only('fetch data with data query', () => {
    let mockQueryFn
    let mockEngine
    beforeEach(() => {
        // Could also be "reset mocks"
        mockQueryFn = jest.fn().mockResolvedValue({
            result: {
                pager: { page: 1, nextPage: true },
                indicators: { msg: 'indicators!' },
                dataElements: { msg: 'dataElements!' },
                dataElementOperands: { msg: 'dataElementOperands!' },
                dataSets: { msg: 'dataSets!' },
                programDataElements: [{ msg: 'programDataElements!' }],
                programIndicators: { msg: 'programIndicators!' },
            },
        })
        mockEngine = { query: mockQueryFn }
    })

    test('it correctly fetches indicators', async () => {
        const result = await fetchAlternatives({
            engine: mockEngine,
            dataType: 'indicators',
            page: 1,
            groupId: 'LWvy9lMdSlH',
            filterText: 'births',
            nameProp: 'displayName',
        })

        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'indicators',
                params: {
                    fields: [
                        'id',
                        'displayName~rename(name)',
                        'dimensionItemType',
                    ],
                    filter: [
                        'indicatorGroups.id:eq:LWvy9lMdSlH',
                        'displayName:ilike:births',
                    ],
                    order: 'displayName:asc',
                    page: 1,
                },
            },
        })
        expect(result.dimensionItems).toMatchObject({ msg: 'indicators!' })
        expect(result.nextPage).toEqual(2)
    })

    test('it correctly fetches data elements', async () => {
        const result = await fetchAlternatives({
            engine: mockEngine,
            nameProp: 'displayName',
            dataType: 'dataElements',
            groupId: 'ALL',
            groupDetail: 'totals',
            page: 1,
        })

        expect(result.dimensionItems).toMatchObject({ msg: 'dataElements!' })
        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'dataElements',
                params: {
                    fields: ['id', 'displayName~rename(name)'],
                    order: 'displayName:asc',
                    filter: ['domainType:eq:AGGREGATE'],
                    page: 1,
                    paging: true,
                },
            },
        })
    })

    test('it correctly fetches data element operands when groupDetail == "detail"', async () => {
        const result = await fetchAlternatives({
            engine: mockEngine,
            dataType: 'dataElements',
            nameProp: 'displayName',
            groupId: 'ALL',
            groupDetail: 'detail',
            page: 1,
        })

        expect(result.dimensionItems).toMatchObject({
            msg: 'dataElementOperands!',
        })
        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'dataElementOperands',
                params: {
                    fields: ['id', 'displayName~rename(name)'],
                    order: 'displayName:asc',
                    filter: [],
                    page: 1,
                    paging: true,
                },
            },
        })
    })

    test('it correctly fetches data sets', async () => {
        const result = await fetchAlternatives({
            engine: mockEngine,
            dataType: 'dataSets',
            nameProp: 'displayName',
            groupId: 'ALL',
            page: 1,
        })

        expect(result.dimensionItems).toMatchObject({
            msg: 'dataSets!',
        })
        expect(mockQueryFn).toHaveBeenCalled()
        expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
            result: {
                resource: 'dataSets',
                params: {
                    fields: [
                        'dimensionItem~rename(id)',
                        'displayName~rename(name)',
                    ],
                    order: 'displayName:asc',
                    filter: [],
                    page: 1,
                    paging: true,
                },
            },
        })
    })

    describe('Handling event data elements', () => {
        test('it sends queries to programDataElements and programs', async () => {
            await fetchAlternatives({
                engine: mockEngine,
                dataType: 'eventDataItems',
                nameProp: 'displayName',
                groupId: 'abc123',
                page: 1,
            })

            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'programDataElements',
                    params: {
                        fields: [
                            'dimensionItem~rename(id)',
                            'displayName~rename(name)',
                            'valueType',
                        ],
                        filter: [],
                        order: 'displayName:asc',
                        program: 'abc123',
                        page: 1,
                        paging: true,
                    },
                },
            })

            expect(mockQueryFn.mock.calls[1][0]).toMatchObject({
                result: {
                    resource: 'programs/abc123',
                    params: {
                        fields: [
                            'displayName~rename(name)',
                            'programTrackedEntityAttributes[trackedEntityAttribute[id,displayName~rename(name),valueType]]',
                        ],
                        filter: [],
                        paging: false,
                    },
                },
            })
        })

        test('it processes resulting data correctly', async () => {
            const eventMockQueryFn = jest
                .fn()
                .mockImplementation(({ result }) => {
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
            const eventMockEngine = { query: eventMockQueryFn }

            const res = await fetchAlternatives({
                engine: eventMockEngine,
                dataType: 'eventDataItems',
                nameProp: 'displayName',
                groupId: 'abc123',
                page: 1,
            })
            const expectedRes = {
                dimensionItems: [
                    { id: 'cc', name: 'Chocolate cake', valueType: 'NUMBER' },
                    {
                        id: 'abc123.broc',
                        name: 'Veggies Broccoli',
                        valueType: 'NUMBER',
                    },
                ],
            }

            expect(res).toMatchObject(expectedRes)
        })
    })

    describe('Program Indicators', () => {
        test('it correctly fetches program indicators', async () => {
            const res = await fetchAlternatives({
                engine: mockEngine,
                dataType: 'programIndicators',
                groupId: 'PROGRAM_ID',
                page: 1,
                nameProp: 'displayName',
                filterText: 'test',
            })

            expect(res).toMatchObject({
                dimensionItems: { msg: 'programIndicators!' },
                nextPage: 2,
            })
            expect(mockQueryFn.mock.calls[0][0]).toMatchObject({
                result: {
                    resource: 'programIndicators',
                    params: {
                        fields: [
                            'dimensionItem~rename(id)',
                            'displayName~rename(name)',
                        ],
                        order: 'displayName:asc',
                        filter: [
                            'program.id:eq:PROGRAM_ID',
                            'displayName:ilike:test',
                        ],
                        page: 1,
                        paging: true,
                    },
                },
            })
        })
    })
})

describe('api: dimensions', () => {
    beforeEach(() => {
        mockGetFn = jest.fn().mockResolvedValue({ pager: {} })
        mockD2 = { Api: { getApi: () => ({ get: mockGetFn }) } }
    })

    describe('apiFetchDimensions', () => {
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
