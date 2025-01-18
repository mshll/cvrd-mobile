import * as React from "react";
import { IAppearanceOptions } from './types';
interface IBottomTabNavigatorProps {
    initialRouteName?: string;
    backBehavior?: "history" | "initialRoute" | "order" | "none" | undefined;
    children: React.ReactNode;
    screenOptions?: any;
    tabBarOptions?: any;
    appearance: Partial<IAppearanceOptions>;
    lazy?: boolean;
}
declare const _default: <ParamList extends import("@react-navigation/native").ParamListBase>() => import("@react-navigation/native").TypedNavigator<ParamList, Readonly<{
    key: string;
    index: number;
    routeNames: string[];
    history?: unknown[] | undefined;
    routes: (Readonly<{
        key: string;
        name: string;
        path?: string | undefined;
    }> & Readonly<{
        params?: Readonly<object | undefined>;
    }> & {
        state?: Readonly<any> | import("@react-navigation/native").PartialState<Readonly<any>> | undefined;
    })[];
    type: string;
    stale: false;
}>, {}, import("@react-navigation/native").EventMapBase, ({ initialRouteName, backBehavior, children, screenOptions, tabBarOptions, appearance, lazy, ...rest }: IBottomTabNavigatorProps) => React.JSX.Element>;
export default _default;
