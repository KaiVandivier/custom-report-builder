const reorderArray = (arr, oldIdx, newIdx) => {
    const validOldIdx = typeof oldIdx === 'number' && 0 <= oldIdx < arr.length
    const validNewIdx = typeof newIdx === 'number' && 0 <= newIdx < arr.length
    if (!validOldIdx || !validNewIdx)
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
