export const reorderArray = (arr, oldIdx, newIdx) => {
    if (!(0 <= oldIdx < arr.length) || !(0 <= newIdx < arr.length))
        throw new Error('reorderArray: invalid index')

    const movedItem = arr[oldIdx]
    const remainingItems = arr.filter((item, idx) => idx !== oldIdx)

    return [
        ...remainingItems.slice(0, newIdx),
        movedItem,
        ...remainingItems.slice(newIdx),
    ]
}

export default reorderArray
