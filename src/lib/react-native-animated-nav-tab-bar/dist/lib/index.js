'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var native = require('@react-navigation/native');
var reactNative = require('react-native');
var reactNativeScreens = require('react-native-screens');
var Styled = require('styled-components/native');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Styled__default = /*#__PURE__*/_interopDefaultLegacy(Styled);

exports.TabElementDisplayOptions = void 0;
(function (TabElementDisplayOptions) {
    TabElementDisplayOptions["ICON_ONLY"] = "icon-only";
    TabElementDisplayOptions["LABEL_ONLY"] = "label-only";
    TabElementDisplayOptions["BOTH"] = "both";
})(exports.TabElementDisplayOptions || (exports.TabElementDisplayOptions = {}));
exports.DotSize = void 0;
(function (DotSize) {
    DotSize["SMALL"] = "small";
    DotSize["MEDIUM"] = "medium";
    DotSize["LARGE"] = "large";
    DotSize["DEFAULT"] = "default"; // not in docs
})(exports.DotSize || (exports.DotSize = {}));
exports.TabButtonLayout = void 0;
(function (TabButtonLayout) {
    TabButtonLayout["VERTICAL"] = "vertical";
    TabButtonLayout["HORIZONTAL"] = "horizontal";
})(exports.TabButtonLayout || (exports.TabButtonLayout = {}));

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Originally from ResourceSavingScene.tsx react-navigation / bottom-tabs
 */
var FAR_FAR_AWAY = 30000; // this should be big enough to move the whole view out of its container
function ResourceSavingScene(_a) {
    var isVisible = _a.isVisible, children = _a.children, style = _a.style, rest = __rest(_a, ["isVisible", "children", "style"]);
    // react-native-screens is buggy on web
    if ((reactNativeScreens.screensEnabled === null || reactNativeScreens.screensEnabled === void 0 ? void 0 : reactNativeScreens.screensEnabled()) && reactNative.Platform.OS !== 'web') {
        return (React__namespace.createElement(reactNativeScreens.Screen, __assign({ activityState: isVisible ? 2 : 0, style: style }, rest), children));
    }
    return (React__namespace.createElement(reactNative.View, { style: [
            styles.container,
            reactNative.Platform.OS === "web"
                ? { display: isVisible ? "flex" : "none" }
                : null,
            style
        ],
        // box-none doesn't seem to work properly on Android
        pointerEvents: isVisible ? 'auto' : 'none' },
        React__namespace.createElement(reactNative.View, { collapsable: false, removeClippedSubviews:
            // On iOS, set removeClippedSubviews to true only when not focused
            // This is an workaround for a bug where the clipped view never re-appears
            reactNative.Platform.OS === 'ios' ? !isVisible : true, pointerEvents: isVisible ? 'auto' : 'none', style: isVisible ? styles.attached : styles.detached }, children)));
}
var styles = reactNative.StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    attached: {
        flex: 1,
    },
    detached: {
        flex: 1,
        top: FAR_FAR_AWAY,
    },
});

// Function extracted from:
// https://github.com/ptelad/react-native-iphone-x-helper
function isIphoneX() {
    var dimen = reactNative.Dimensions.get('window');
    return (reactNative.Platform.OS === 'ios' &&
        !reactNative.Platform.isPad &&
        !reactNative.Platform.isTV &&
        ((dimen.height === 780 || dimen.width === 780)
            || (dimen.height === 812 || dimen.width === 812)
            || (dimen.height === 844 || dimen.width === 844)
            || (dimen.height === 896 || dimen.width === 896)
            || (dimen.height === 926 || dimen.width === 926)
            || (dimen.height === 852 || dimen.width === 852)
            || (dimen.height === 844 || dimen.width === 844)
            || (dimen.height === 926 || dimen.width === 926)
            || (dimen.height === 932 || dimen.width === 932)));
}

// Config
var BOTTOM_PADDING = 20;
var BOTTOM_PADDING_IPHONE_X = 30;
var floatingMarginBottom = Styled.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: ", "px;\n"], ["\n  margin-bottom: ", "px;\n"])), isIphoneX() ? BOTTOM_PADDING_IPHONE_X : BOTTOM_PADDING);
var floatingMarginHorizontal = Styled.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-horizontal: 20px;\n"], ["\n  margin-horizontal: 20px;\n"])));
var floatingRoundCorner = Styled.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  border-radius: 15px;\n"], ["\n  border-radius: 15px;\n"])));
var BottomTabBarWrapper = Styled__default["default"].View(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\tflex-direction: row;\n\t", ";\n    elevation: 2;\n\t", ";\n\t", ";\n  padding-bottom: ", "px;\n  padding-top: ", "px;\n  padding-horizontal: ", "px;\n  background-color: ", ";\n\t", ";\n\n  "], ["\n\tflex-direction: row;\n\t", ";\n    elevation: 2;\n\t", ";\n\t", ";\n  padding-bottom: ", "px;\n  padding-top: ", "px;\n  padding-horizontal: ", "px;\n  background-color: ", ";\n\t", ";\n\n  "])), function (p) { return p.floating && floatingMarginHorizontal; }, function (p) { return p.floating && floatingMarginBottom; }, function (p) { return p.floating && floatingRoundCorner; }, function (p) {
    return p.floating
        ? p.bottomPadding
        : isIphoneX()
            ? BOTTOM_PADDING_IPHONE_X + p.bottomPadding
            : p.bottomPadding;
}, function (p) { return p.topPadding; }, function (p) { return p.horizontalPadding; }, function (p) { return p.tabBarBackground; }, function (p) { return p.shadow && SHADOW; });
var calculateDotSize = function (size) {
    switch (size) {
        case exports.DotSize.SMALL:
            return 40;
        case exports.DotSize.MEDIUM:
            return 10;
        case exports.DotSize.LARGE:
            return 5;
        default:
            return 10;
    }
};
var TabButton = Styled__default["default"].TouchableOpacity(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\tflex: 1;\n\tflex-direction: ", ";\n\tjustify-content: center;\n\talign-items: center;\n\tborder-radius: 100px;\n\tpadding-vertical: 10px;\n\tflex-grow: ", ";\n"], ["\n\tflex: 1;\n\tflex-direction: ", ";\n\tjustify-content: center;\n\talign-items: center;\n\tborder-radius: 100px;\n\tpadding-vertical: 10px;\n\tflex-grow: ", ";\n"])), function (p) {
    return p.tabButtonLayout == exports.TabButtonLayout.VERTICAL
        ? "column"
        : p.tabButtonLayout == exports.TabButtonLayout.HORIZONTAL
            ? "row"
            : "row";
}, function (p) {
    return 1;
});
var Label = Styled__default["default"](reactNative.Animated.Text)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\tfontSize: ", "px;\n\tcolor: ", ";\n\tmargin-left: ", "px;\n"], ["\n\tfontSize: ", "px;\n\tcolor: ", ";\n\tmargin-left: ", "px;\n"])), function (p) {
    return p.whenInactiveShow == exports.TabElementDisplayOptions.BOTH || p.whenActiveShow == exports.TabElementDisplayOptions.BOTH ? "14" : "17";
}, function (p) { return p.activeColor; }, function (p) {
    return (p.whenActiveShow == exports.TabElementDisplayOptions.BOTH || p.whenInactiveShow == exports.TabElementDisplayOptions.BOTH) &&
        p.tabButtonLayout == exports.TabButtonLayout.HORIZONTAL
        ? 8
        : 0;
});
var Dot = Styled__default["default"](reactNative.Animated.View)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\tposition: absolute;\n\ttop: ", "px;\n\twidth: ", "px;\n\theight: ", "px;\n\tborder-radius: ", "px;\n\tbackground-color: ", ";\n\tz-index: -1;\n"], ["\n\tposition: absolute;\n\ttop: ", "px;\n\twidth: ", "px;\n\theight: ", "px;\n\tborder-radius: ", "px;\n\tbackground-color: ", ";\n\tz-index: -1;\n"])), function (p) { return p.topPadding; }, function (p) { return p.width; }, function (p) { return p.height; }, function (p) { return 0; }, function (p) { return p.activeTabBackground; });
var SHADOW = Styled.css(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  shadow-color: #000000;\n  shadow-offset: 0px 5px;\n  shadow-opacity: 0.05;\n  elevation: 1;\n  shadow-radius: 20px;\n"], ["\n  shadow-color: #000000;\n  shadow-offset: 0px 5px;\n  shadow-opacity: 0.05;\n  elevation: 1;\n  shadow-radius: 20px;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;

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
var TabBarElement = (function (_a) {
    var state = _a.state, navigation = _a.navigation, descriptors = _a.descriptors, appearance = _a.appearance, tabBarOptions = _a.tabBarOptions, lazy = _a.lazy;
    // Appearance options destruction
    var topPadding = appearance.topPadding, bottomPadding = appearance.bottomPadding, horizontalPadding = appearance.horizontalPadding, tabBarBackground = appearance.tabBarBackground, activeTabBackgrounds = appearance.activeTabBackgrounds, activeColors = appearance.activeColors, floating = appearance.floating, dotCornerRadius = 0, whenActiveShow = appearance.whenActiveShow, whenInactiveShow = appearance.whenInactiveShow, dotSize = appearance.dotSize, shadow = appearance.shadow, tabButtonLayout = appearance.tabButtonLayout;
    var activeTintColor = tabBarOptions.activeTintColor, inactiveTintColor = tabBarOptions.inactiveTintColor, activeBackgroundColor = tabBarOptions.activeBackgroundColor, tabStyle = tabBarOptions.tabStyle, labelStyle = tabBarOptions.labelStyle;
    // State
    var _b = React.useState(horizontalPadding), prevPos = _b[0], setPrevPos = _b[1];
    var _c = React.useState(prevPos), pos = _c[0], setPos = _c[1];
    var _d = React.useState(0), width = _d[0], setWidth = _d[1];
    var _e = React.useState(0), height = _e[0], setHeight = _e[1];
    var animatedPos = React.useState(function () { return new reactNative.Animated.Value(1); })[0];
    var _f = React.useState([state.index]), loaded = _f[0], setLoaded = _f[1];
    React.useEffect(function () {
        var index = state.index;
        setLoaded(loaded.includes(index) ? loaded : __spreadArray(__spreadArray([], loaded, true), [index], false));
    }, [state]);
    // false = Portrait
    // true = Landscape
    var _g = React.useState(true), isPortrait = _g[0], setIsPortrait = _g[1];
    // Reset animation when changing screen orientation
    reactNative.Dimensions.addEventListener("change", function () {
        if ((isPortrait && !didChangeToPortrait()) ||
            (!isPortrait && didChangeToPortrait())) {
            setIsPortrait(!isPortrait);
            animation(animatedPos).start(function () {
                updatePrevPos();
            });
        }
    });
    /**
     * @returns true if current orientation is Portrait, false otherwise
     */
    var didChangeToPortrait = function () {
        var dim = reactNative.Dimensions.get("screen");
        return dim.height >= dim.width;
    };
    /**
     * Dot animation
     * @param {*} val animation value
     * @returns Animated.CompositeAnimation
     * Use .start() to start the animation
     */
    var animation = function (val) {
        return reactNative.Animated.spring(val, {
            toValue: 1,
            useNativeDriver: false,
        });
    };
    /**
     * Helper function that updates the previous position
     * of the tab to calculate the new position.
     */
    var updatePrevPos = function () {
        setPos(function (pos) {
            setPrevPos(pos);
            return pos;
        });
        animatedPos.setValue(0);
    };
    /**
     * Handles physical button press for Android
     */
    var handleBackPress = function () {
        animation(animatedPos).start(function () {
            updatePrevPos();
        });
        return false;
    };
    React.useEffect(function () {
        animation(animatedPos).start(function () {
            updatePrevPos();
        });
        if (reactNative.Platform.OS === "android") {
            reactNative.BackHandler.addEventListener("hardwareBackPress", handleBackPress);
        }
        return function () {
            if (reactNative.Platform.OS === "android") {
                reactNative.BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
            }
        };
    }, []);
    /**
     * Animate whenever the navigation state changes
     */
    React.useEffect(function () {
        animation(animatedPos).start(function () {
            updatePrevPos();
        });
    }, [state.index]);
    // Compute activeBackgroundColor, if array provided, use array otherwise fallback to
    // default tabBarOptions property activeBackgroundColor (fallbacks for all unspecified tabs)
    var activeTabBackground = activeTabBackgrounds
        ? Array.isArray(activeTabBackgrounds)
            ? activeTabBackgrounds[state.index] || activeBackgroundColor
            : activeTabBackgrounds
        : activeBackgroundColor;
    // Compute activeBackgroundColor, if array provided, use array otherwise fallback to
    // default tabBarOptions property activeTintColor (fallbacks for all unspecified tabs)
    var activeColor = activeColors
        ? Array.isArray(activeColors)
            ? activeColors[state.index] || activeTintColor
            : activeColors
        : activeTintColor;
    /**
     * Create a tab button given a route and route index
     * @param {*} route
     * @param {*} routeIndex
     * @returns React.Node with the button component
     */
    var createTab = function (route, routeIndex) {
        var focused = routeIndex == state.index;
        var options = descriptors[route.key].options;
        var tintColor = focused ? activeColor : inactiveTintColor;
        var icon = options.tabBarIcon;
        var label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
                ? options.title
                : route.name;
        var accessibilityLabel = options.tabBarAccessibilityLabel !== undefined
            ? options.tabBarAccessibilityLabel
            : typeof label === "string"
                ? "".concat(label, ", tab, ").concat(routeIndex + 1, " of ").concat(state.routes.length)
                : undefined;
        // Render the label next to the icon
        // only if showLabel is true
        var renderLabel = function () {
            if (typeof label === "string") {
                return (React__default["default"].createElement(Label, { tabButtonLayout: tabButtonLayout, whenActiveShow: whenActiveShow, whenInactiveShow: whenInactiveShow, style: labelStyle, activeColor: tintColor }, label));
            }
            else {
                return label({ focused: focused, color: activeColor });
            }
        };
        /**
         * Helper function to render the icon
         */
        var renderIcon = function () {
            if (icon === undefined) {
                return null;
            }
            var defaultIconSize = 20;
            return icon({ focused: focused, color: tintColor, size: defaultIconSize });
        };
        /**
         * On Press Handler
         * Emits an event to the navigation
         */
        var onPress = function () {
            animation(animatedPos).start(function () {
                updatePrevPos();
            });
            var event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
                navigation.dispatch(__assign(__assign({}, native.CommonActions.navigate(route.name)), { target: state.key }));
            }
        };
        /**
         * On Long Press Handler
         * Emits an event to the navigation
         */
        var onLongPress = function () {
            animation(animatedPos).start(function () {
                updatePrevPos();
            });
            navigation.emit({
                type: "tabLongPress",
                target: route.key,
            });
        };
        /**
         * Read the position and dimension of a tab.
         * and update animation state
         * @param {*} e
         */
        var onLayout = function (e) {
            if (focused) {
                setPos(e.nativeEvent.layout.x);
                setWidth(e.nativeEvent.layout.width);
                setHeight(e.nativeEvent.layout.height);
            }
        };
        var labelAndIcon = function () {
            if (focused) {
                switch (whenActiveShow) {
                    case exports.TabElementDisplayOptions.BOTH:
                        return (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(reactNative.View, null, renderIcon()),
                            renderLabel()));
                    case exports.TabElementDisplayOptions.LABEL_ONLY:
                        return renderLabel();
                    case exports.TabElementDisplayOptions.ICON_ONLY:
                        return renderIcon();
                    default:
                        return (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(reactNative.View, null, renderIcon()),
                            renderLabel()));
                }
            }
            else {
                switch (whenInactiveShow) {
                    case exports.TabElementDisplayOptions.BOTH:
                        return (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(reactNative.View, null, renderIcon()),
                            renderLabel()));
                    case exports.TabElementDisplayOptions.LABEL_ONLY:
                        return renderLabel();
                    case exports.TabElementDisplayOptions.ICON_ONLY:
                        return renderIcon();
                    default:
                        return (React__default["default"].createElement(React__default["default"].Fragment, null,
                            React__default["default"].createElement(reactNative.View, null, renderIcon()),
                            renderLabel()));
                }
            }
        };
        return (React__default["default"].createElement(TabButton, { key: route.key, focused: focused, labelLength: label.length, accessibilityLabel: accessibilityLabel, onLayout: onLayout, onPress: onPress, onLongPress: onLongPress, dotSize: dotSize, tabButtonLayout: tabButtonLayout }, labelAndIcon()));
    };
    var overlayStyle = reactNative.StyleSheet.create({
        overlayStyle: {
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            position: "absolute",
        },
    }).overlayStyle;
    var options = descriptors[state.routes[state.index].key].options;
    var tabBarVisible = options.tabBarVisible == undefined ? true : options.tabBarVisible;
    return (React__default["default"].createElement(React__default["default"].Fragment, null,
        React__default["default"].createElement(reactNative.View, { style: {
                flex: 1,
                overflow: "hidden",
            } },
            React__default["default"].createElement(reactNativeScreens.ScreenContainer, { style: { flex: 1 } }, state.routes.map(function (route, index) {
                var descriptor = descriptors[route.key];
                var unmountOnBlur = descriptor.options.unmountOnBlur;
                var isFocused = state.index === index;
                if (unmountOnBlur && !isFocused) {
                    return null;
                }
                if (lazy && !loaded.includes(index) && !isFocused) {
                    // Don't render a screen if we've never navigated to it
                    return null;
                }
                return (React__default["default"].createElement(ResourceSavingScene, { key: route.key, isVisible: isFocused, style: reactNative.StyleSheet.absoluteFill },
                    React__default["default"].createElement(reactNative.View, { accessibilityElementsHidden: !isFocused, importantForAccessibility: isFocused ? "auto" : "no-hide-descendants", style: { flex: 1 } }, descriptor.render())));
            }))),
        tabBarVisible && (React__default["default"].createElement(reactNative.View, { pointerEvents: "box-none", style: floating && overlayStyle },
            React__default["default"].createElement(BottomTabBarWrapper, { style: tabStyle, floating: floating, topPadding: topPadding, bottomPadding: bottomPadding, horizontalPadding: horizontalPadding, tabBarBackground: tabBarBackground, shadow: shadow },
                state.routes.map(createTab))))));
});

var defaultAppearance = {
    topPadding: 10,
    bottomPadding: 10,
    horizontalPadding: 10,
    tabBarBackground: "#FFFFFF",
    floating: false,
    dotCornerRadius: 0,
    whenActiveShow: exports.TabElementDisplayOptions.BOTH,
    whenInactiveShow: exports.TabElementDisplayOptions.ICON_ONLY,
    shadow: false,
    dotSize: 0,
    tabButtonLayout: exports.TabButtonLayout.HORIZONTAL,
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
    var initialRouteName = _a.initialRouteName, backBehavior = _a.backBehavior, children = _a.children, screenOptions = _a.screenOptions, tabBarOptions = _a.tabBarOptions, appearance = _a.appearance; _a.lazy; var rest = __rest(_a, ["initialRouteName", "backBehavior", "children", "screenOptions", "tabBarOptions", "appearance", "lazy"]);
    var _c = native.useNavigationBuilder(native.TabRouter, {
        initialRouteName: initialRouteName,
        backBehavior: backBehavior,
        children: children,
        screenOptions: screenOptions,
    }), state = _c.state, descriptors = _c.descriptors, navigation = _c.navigation;
    var finalAppearance = __assign(__assign({}, defaultAppearance), appearance);
    var finalTabBarOptions = __assign(__assign({}, defaultTabBarOptions), tabBarOptions);
    return (React__namespace.createElement(TabBarElement, __assign({}, rest, { state: state, navigation: navigation, descriptors: descriptors, tabBarOptions: finalTabBarOptions, appearance: finalAppearance })));
};
var AnimatedTabBarNavigator = native.createNavigatorFactory(BottomTabNavigator);

exports.AnimatedTabBarNavigator = AnimatedTabBarNavigator;
