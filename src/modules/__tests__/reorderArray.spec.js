import reorderArray from '../reorderArray'

it('reorders an array', () => {
    const arr = ['1', '2', '3']
    const res = reorderArray(arr, 0, 1)
    expect(res[0]).toEqual(arr[1])
    expect(res[1]).toEqual(arr[0])
})

it.only('throws an error with invalid indices', () => {
    expect(() => reorderArray(['1', '2', '3'], 'a', 'a')).toThrow()
})
