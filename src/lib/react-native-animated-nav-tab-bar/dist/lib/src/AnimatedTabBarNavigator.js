var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as React from "react";
import { DotSize, TabButtonLayout, TabElementDisplayOptions } from './types';
import { TabRouter, createNavigatorFactory, useNavigationBuilder, } from "@react-navigation/native";
import TabBarElement from "./TabBarElement";
var defaultAppearance = {
    topPadding: 10,
    bottomPadding: 10,
    horizontalPadding: 10,
    tabBarBackground: "#FFFFFF",
    floating: false,
    dotCornerRadius: 100,
    whenActiveShow: TabElementDisplayOptions.BOTH,
    whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
    shadow: false,
    dotSize: DotSize.DEFAULT,
    tabButtonLayout: TabButtonLayout.HORIZONTAL,
    activeColors: undefined,
    activeTabBackgrounds: undefined,
};
var defaultTabBarOptions = {
    activeTintColor: "black",
    inactiveTintColor: "black",
    activeBackgroundColor: "#FFCF64",
    labelStyle: {
        fontWeight: "bold",
    },
};
var BottomTabNavigator = function (_a) {
    var initialRouteName = _a.initialRouteName, backBehavior = _a.backBehavior, children = _a.children, screenOptions = _a.screenOptions, tabBarOptions = _a.tabBarOptions, appearance = _a.appearance, _b = _a.lazy, lazy = _b === void 0 ? true : _b, rest = __rest(_a, ["initialRouteName", "backBehavior", "children", "screenOptions", "tabBarOptions", "appearance", "lazy"]);
    var _c = useNavigationBuilder(TabRouter, {
        initialRouteName: initialRouteName,
        backBehavior: backBehavior,
        children: children,
        screenOptions: screenOptions,
    }), state = _c.state, descriptors = _c.descriptors, navigation = _c.navigation;
    var finalAppearance = __assign(__assign({}, defaultAppearance), appearance);
    var finalTabBarOptions = __assign(__assign({}, defaultTabBarOptions), tabBarOptions);
    return (React.createElement(TabBarElement, __assign({}, rest, { state: state, navigation: navigation, descriptors: descriptors, tabBarOptions: finalTabBarOptions, appearance: finalAppearance })));
};
export default createNavigatorFactory(BottomTabNavigator);
