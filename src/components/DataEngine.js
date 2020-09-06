import { useDataEngine } from '@dhis2/app-runtime'

export const DataEngine = ({ children }) => {
    const engine = useDataEngine()

    return children(engine)
}

export default DataEngine
