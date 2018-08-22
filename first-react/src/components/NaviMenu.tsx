import * as React from 'react';
import { NavLink } from 'react-router-dom';

export class NavMenu extends React.Components<{}, {}> {
    public render() {
        return <div>
            <NavLink exact to={ '/' }></NavLink>
            <NavLink exact to={ '/' }></NavLink>
        </div>
    }
}
