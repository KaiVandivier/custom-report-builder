export const reorderArray = (arr, oldIdx, newIdx) => {
    const movedItem = arr[oldIdx]
    const remainingItems = arr.filter((item, idx) => idx !== oldIdx)

    return [
        ...remainingItems.slice(0, newIdx),
        movedItem,
        ...remainingItems.slice(newIdx),
    ]
}

export default reorderArray
