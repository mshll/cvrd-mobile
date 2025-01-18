import { Descriptor, TabNavigationState } from "@react-navigation/native";
import React from "react";
import { IAppearanceOptions } from "./types";
interface TabBarElementProps {
    state: TabNavigationState<Record<string, object | undefined>>;
    navigation: any;
    descriptors: Record<string, Descriptor<any, any, any>>;
    appearance: IAppearanceOptions;
    tabBarOptions?: any;
    lazy?: boolean;
}
/**
 * @name TabBarElement
 * React Navigation v5 custom navigation (bottom tab bar) builder with an
 * an interactive animation, and easily customizable.
 *
 * @param state Navigation state
 * @param navigation Navigation object
 * @param descriptors
 * @param appearance Object with appearance configurations (see readme)
 * @param rest
 *
 * @return function that creates the custom tab bar
 */
declare const _default: ({ state, navigation, descriptors, appearance, tabBarOptions, lazy, }: TabBarElementProps) => React.JSX.Element;
export default _default;
