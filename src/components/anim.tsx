import { useEffect, useState, ReactNode } from 'react';
import { Text, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withDelay, interpolate,
} from 'react-native-reanimated';

// Scale + opacity ile yaylanarak giren sarmalayıcı
export function SpringIn({ delay = 0, children, style }: {
  delay?: number; children: ReactNode; style?: StyleProp<ViewStyle>;
}) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withSpring(1, { damping: 12, stiffness: 160 }));
  }, [delay, p]);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: interpolate(p.value, [0, 1], [0.5, 1]) }],
  }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

// 0'dan hedefe sayan metin (ease-out cubic)
export function CountUp({ value, duration = 900, prefix = '', style }: {
  value: number; duration?: number; prefix?: string; style?: StyleProp<TextStyle>;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value <= 0) { setDisplay(value); return; }
    const start = Date.now();
    const timer = setInterval(() => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t >= 1) clearInterval(timer);
    }, 33);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <Text style={style}>{prefix}{display.toLocaleString()}</Text>;
}
