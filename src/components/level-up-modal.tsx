import { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../constants/colors';
import { Fonts } from '../constants/typography';
import { Confetti } from './confetti';
import { SpringIn } from './anim';

export function LevelUpModal({ level, visible, onClose }: {
  level: number; visible: boolean; onClose: () => void;
}) {
  useEffect(() => {
    if (visible) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <Confetti />
        <SpringIn style={s.card}>
          <View style={s.iconWrap}>
            <SymbolView name="crown.fill" size={44} tintColor={Colors.warning} type="monochrome" />
          </View>
          <Text style={s.title}>Seviye Atladın!</Text>
          <Text style={s.levelText}>Seviye {level}</Text>
          <Text style={s.desc}>Muhteşem ilerliyorsun — böyle devam et!</Text>
          <TouchableOpacity style={s.btn} onPress={onClose} activeOpacity={0.88}>
            <Text style={s.btnText}>Devam Et</Text>
          </TouchableOpacity>
        </SpringIn>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(24,24,27,0.55)', alignItems: 'center', justifyContent: 'center', padding: 32 },
  card: {
    width: '100%', backgroundColor: Colors.bgCard, borderRadius: 28,
    padding: 28, alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 28, elevation: 12,
  },
  iconWrap: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: Colors.warningLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 2, borderColor: Colors.warning + '40',
  },
  title: { fontSize: 24, fontFamily: Fonts.headingBlack, color: Colors.textPrimary, letterSpacing: -0.3 },
  levelText: { fontSize: 40, fontFamily: Fonts.headingBlack, color: Colors.primary, letterSpacing: -1 },
  desc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 14, width: '100%', backgroundColor: Colors.primary, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
