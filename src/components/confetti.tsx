import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing, interpolate,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

const { width: W, height: H } = Dimensions.get('window');
const PALETTE = [Colors.primary, Colors.accent, Colors.green, Colors.purple, Colors.blue, '#EC4899'];
const PIECE_COUNT = 40;

function Piece({ index }: { index: number }) {
  const progress = useSharedValue(0);
  const seed = useMemo(() => ({
    x: Math.random() * W,
    delay: Math.random() * 500,
    duration: 2200 + Math.random() * 1400,
    drift: (Math.random() - 0.5) * 140,
    spin: (Math.random() - 0.5) * 900,
    size: 6 + Math.random() * 6,
    color: PALETTE[index % PALETTE.length],
    isRect: index % 3 !== 0,
  }), [index]);

  useEffect(() => {
    progress.value = withDelay(
      seed.delay,
      withTiming(1, { duration: seed.duration, easing: Easing.in(Easing.quad) }),
    );
  }, [seed, progress]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: seed.x + interpolate(progress.value, [0, 1], [0, seed.drift]) },
      { translateY: interpolate(progress.value, [0, 1], [-40, H + 60]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, seed.spin])}deg` },
    ],
    opacity: interpolate(progress.value, [0, 0.75, 1], [1, 1, 0]),
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        width: seed.size,
        height: seed.isRect ? seed.size * 0.55 : seed.size,
        borderRadius: seed.isRect ? 1.5 : seed.size / 2,
        backgroundColor: seed.color,
      }, anim]}
    />
  );
}

// Bir kez mount edilir, parçacıklar düşüp kaybolur — parent görünürlüğü kontrol eder
export function Confetti() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: PIECE_COUNT }).map((_, i) => <Piece key={i} index={i} />)}
    </View>
  );
}
