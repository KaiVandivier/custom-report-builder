import css from 'styled-jsx/css'
import { spacers } from '@dhis2/ui'

export default css`
    .titleContainer {
        padding: ${spacers.dp4} ${spacers.dp8} 0 ${spacers.dp8};
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .rowTitle {
        height: 60px; // to match height of 'ContentTypeSelector'
    }
`
