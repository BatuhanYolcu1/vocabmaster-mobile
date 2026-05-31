import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/colors';

function TabIcon({ focused, name }: { focused: boolean; name: string }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <SymbolView
        name={name as any}
        size={21}
        tintColor={focused ? Colors.primary : Colors.tabInactive}
        type="monochrome"
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar, tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="house.fill" /> }}
      />
      <Tabs.Screen
        name="categories"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="books.vertical.fill" /> }}
      />
      <Tabs.Screen
        name="study"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.studyBtn, focused && styles.studyBtnActive]}>
              <SymbolView name="play.fill" size={19} tintColor="#fff" type="monochrome" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="chart.bar.fill" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon focused={focused} name="person.fill" /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: Colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  iconWrap: {
    width: 44,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: Colors.primaryLight,
  },
  studyBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  studyBtnActive: {
    shadowOpacity: 0.5,
  },
});
