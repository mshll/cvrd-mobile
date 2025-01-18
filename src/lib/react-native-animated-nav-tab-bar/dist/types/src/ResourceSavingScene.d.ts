import * as React from "react";
type Props = {
    isVisible: boolean;
    children: React.ReactNode;
    enabled?: boolean;
    style?: any;
};
export default function ResourceSavingScene({ isVisible, children, style, ...rest }: Props): React.JSX.Element;
export {};
