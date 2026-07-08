import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import {Colors} from '../constants/colors'
import MiniPlayer from '../components/MiniPlayer';


const Navlayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.lred,
        tabBarStyle: styles.tabBar,
      }}>
        <Tabs.Screen name="home" options={{ title: "Home",
          tabBarIcon: (({ focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={focused ? Colors.red : Colors.lred} />
          ))
        }} />
        <Tabs.Screen name="search" options={{ title: "Search",
          tabBarIcon: (({ focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={focused ? Colors.red : Colors.lred} />
          ))
        }} />
        <Tabs.Screen name="profile" options={{ title: "Profile",
          tabBarIcon: (({ focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? Colors.red : Colors.lred} />
          ))
        }} />
      </Tabs>
      <MiniPlayer />
    </View>
    

  );
};

export default Navlayout;

const styles = StyleSheet.create({
  tabBar: {
     backgroundColor: Colors.rbgc,
  borderTopColor: Colors.red,
  position: 'absolute',
  bottom: 10,
  left: 0,
  right: 0,
  },
});
