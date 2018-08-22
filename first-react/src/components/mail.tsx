
import { mailActionCreators } from "../store";
import * as React from 'react';

class MailPage extends React.Component<Props, State> {
    constructor(props: props, state: State) {
        super(props, state)
        this.state = {
            data:[]
        }
    }
}
export default connect(
    (state: AppState) => state.mailState,
    mailActionCreators
)(MailPage) as typeof MailPage;