import * as React from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component<{}, {}> {
    /**
     * route in children 无实体
     */
    public render() {
        return <div>
            <NavMenu />
            {this.props.children}
        </div>
    }
}