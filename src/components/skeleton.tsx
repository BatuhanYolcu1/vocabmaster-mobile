import { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';
import { Colors } from '../constants/colors';

export function Skeleton({ width, height, radius = 12, style }: {
  width: number | `${number}%`; height: number; radius?: number; style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 650 }),
        withTiming(0.4, { duration: 650 }),
      ), -1, false,
    );
  }, [opacity]);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ width, height, borderRadius: radius, backgroundColor: Colors.borderLight }, anim, style]}
    />
  );
}

// Study modlarının yükleme durumu: kart + buton iskeleti
export function StudySkeleton() {
  return (
    <SafeAreaView style={sk.safe}>
      <View style={sk.body}>
        <View style={sk.headerRow}>
          <Skeleton width={36} height={36} radius={18} />
          <Skeleton width="55%" height={8} radius={4} />
          <Skeleton width={48} height={28} radius={14} />
        </View>
        <Skeleton width="100%" height={340} radius={22} />
        <View style={sk.bottomRow}>
          <Skeleton width="100%" height={56} radius={16} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const sk = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 14, gap: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' },
  bottomRow: { marginTop: 'auto', paddingBottom: 24 },
});
