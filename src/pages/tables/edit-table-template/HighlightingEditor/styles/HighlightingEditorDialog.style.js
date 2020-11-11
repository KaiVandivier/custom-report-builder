import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .color-swatch {
        height: 1rem;
        width: 2rem;
        border: 1px solid ${colors.grey600};
    }

    .text-container {
        padding-left: 0.25rem;
        line-height: 33px;
    }

    .field-container {
        max-width: 200px;
        margin-right: auto;
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
