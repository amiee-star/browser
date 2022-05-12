import { ForwardRefExoticComponent, CSSProperties } from 'react';
import { ElementType, Merge, ComponentPropsWithRef, FluidProps, FluidValue } from '@react-spring/shared';
export * from '@react-spring/core/index.cjs.js';

declare type Primitives = keyof JSX.IntrinsicElements;

declare type AnimatedPrimitives = {
    [Tag in Primitives]: AnimatedComponent<Tag>;
};
/** The type of the `animated()` function */
declare type WithAnimated = {
    <T extends ElementType>(wrappedComponent: T): AnimatedComponent<T>;
} & AnimatedPrimitives;
/** The type of an `animated()` component */
declare type AnimatedComponent<T extends ElementType> = ForwardRefExoticComponent<AnimatedProps<Merge<ComponentPropsWithRef<T>, {
    style?: StyleProps;
}>> & FluidProps<{
    scrollTop?: number;
    scrollLeft?: number;
}>>;
/** The props of an `animated()` component */
declare type AnimatedProps<Props extends object> = {
    [P in keyof Props]: P extends 'ref' | 'key' ? Props[P] : AnimatedProp<Props[P]>;
};
declare type StyleProps = Merge<CSSProperties, TransformProps>;
declare type StylePropKeys = keyof StyleProps;
declare type ValidStyleProps<T extends object> = {
    [P in keyof T & StylePropKeys]: T[P] extends StyleProps[P] ? P : never;
}[keyof T & StylePropKeys];
declare type AnimatedProp<T> = [T, T] extends [infer T, infer DT] ? [DT] extends [never] ? never : DT extends void ? undefined : DT extends object ? [ValidStyleProps<DT>] extends [never] ? DT extends ReadonlyArray<any> ? AnimatedStyles<DT> : DT : AnimatedStyle<T> : DT | AnimatedLeaf<T> : never;
declare type AnimatedStyles<T extends ReadonlyArray<any>> = {
    [P in keyof T]: [T[P]] extends [infer DT] ? DT extends object ? [ValidStyleProps<DT>] extends [never] ? DT extends ReadonlyArray<any> ? AnimatedStyles<DT> : DT : {
        [P in keyof DT]: AnimatedProp<DT[P]>;
    } : DT : never;
};
declare type AnimatedStyle<T> = [T, T] extends [infer T, infer DT] ? DT extends void ? undefined : [DT] extends [never] ? never : DT extends object ? AnimatedObject<DT> : DT | AnimatedLeaf<T> : never;
declare type AnimatedObject<T extends object> = {
    [P in keyof T]: AnimatedStyle<T[P]>;
} | (T extends ReadonlyArray<number | string> ? FluidValue<Readonly<T>> : never);
declare type AnimatedLeaf<T> = Exclude<T, object | void> | Extract<T, ReadonlyArray<number | string>> extends infer U ? [U] extends [never] ? never : FluidValue<U | Exclude<T, object | void>> : never;
declare type Angle = number | string;
declare type Length = number | string;
declare type TransformProps = {
    transform?: string;
    x?: Length;
    y?: Length;
    z?: Length;
    translate?: Length | readonly [Length, Length];
    translateX?: Length;
    translateY?: Length;
    translateZ?: Length;
    translate3d?: readonly [Length, Length, Length];
    rotate?: Angle;
    rotateX?: Angle;
    rotateY?: Angle;
    rotateZ?: Angle;
    rotate3d?: readonly [number, number, number, Angle];
    scale?: number | readonly [number, number] | string;
    scaleX?: number;
    scaleY?: number;
    scaleZ?: number;
    scale3d?: readonly [number, number, number];
    skew?: Angle | readonly [Angle, Angle];
    skewX?: Angle;
    skewY?: Angle;
    matrix?: readonly [number, number, number, number, number, number];
    matrix3d?: readonly [number, // a1
    number, number, number, number, // a2
    number, number, number, number, // a3
    number, number, number, number, // a4
    number, number, number];
};

declare const animated: WithAnimated;

export { AnimatedComponent, AnimatedProps, WithAnimated, animated as a, animated };
