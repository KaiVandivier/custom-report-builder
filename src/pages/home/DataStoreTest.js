import React from 'react'
import { useSavedObjectList } from '@dhis2/app-service-datastore'

// TODO: Write in docs

export function DataStoreTest() {
    const [savedObjectList, savedObjectListActions] = useSavedObjectList({
        global: true,
    })

    console.log(savedObjectList)
    console.log(savedObjectListActions)

    async function createNewThing() {
        const id = await savedObjectListActions.add({ message: 'hello!' })
        console.log(id)
    }

    async function updateThing() {
        savedObjectList.forEach(obj => {
            savedObjectListActions.remove(obj.id)
        })
        const res = await savedObjectListActions.update(
            '87d686d5-309a-42f6-8991-38a163a22828',
            {
                newKey: 'newValue',
            }
        )
        console.log(res)
    }

    return (
        <div>
            <button onClick={createNewThing}>Create new thing</button>
            <button onClick={updateThing}>Update thing</button>
        </div>
    )
}
