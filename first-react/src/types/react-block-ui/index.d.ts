declare module 'react-block-ui' {
    import * as React from 'react';
    interface BlockUiProps extends RegExpMatchArray.HTMLProps<BlockUi> {
        blocking?: boolean;
        children: React.ReactNode;
        tag?: string | (() => void);
    }
}