import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .color-swatch {
        height: 1rem;
        width: 2rem;
        border: 1px solid ${colors.grey600};
    }

    .color-swatch.green {
        background-color: ${colors.green100};
    }

    .color-swatch.yellow {
        background-color: ${colors.yellow100};
    }

    .color-swatch.red {
        background-color: ${colors.red100};
    }
`
