import { useDataEngine } from '@dhis2/app-runtime'

const DataEngine = ({ children }) => {
    const engine = useDataEngine()

    return children(engine)
}

export default DataEngine
