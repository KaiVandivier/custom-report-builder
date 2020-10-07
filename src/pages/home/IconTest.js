import React from 'react'
import {
    Account,
    Apps,
    ArrowDown,
    AttachFile,
    CancelOutline,
    CheckboxDense,
    ChevronLeft,
    Close,
    Email,
    Empty,
    Exit,
    Help,
    Info,
    RadioDense,
    Single,
    StatusIcon,
    SwitchRegular,
} from '@dhis2/ui-icons'

export default function IconTest() {
    return (
        <div>
            <Account />
            <Apps />
            <ArrowDown />
            <AttachFile />
            <CancelOutline />
            <CheckboxDense />
            <ChevronLeft />
            <Close />
            <Email />
            <Empty />
            <Exit />
            <Help />
            <Info />
            <RadioDense />
            <Single />
            <StatusIcon warning />
            <StatusIcon info />
            <StatusIcon loading />
            <StatusIcon error />
            <StatusIcon valid />
            <SwitchRegular />
            <SwitchRegular className="indeterminate valid" />
        </div>
    )
}
