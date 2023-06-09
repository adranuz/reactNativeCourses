/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {MenuItem} from '../interfaces/appInterfaces';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack/lib/typescript/src/types';
import {RootStackParamList} from '../navigartors/StackNavigator';

interface ItemProps {
  item: MenuItem;
  index?: number;
  separators?: any;
}
export default function MenuiItem({item}: ItemProps) {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      style={itemStyles.listItem}
      onPress={() =>
        navigation.navigate(item.component as keyof RootStackParamList)
      }>
      <Icon
        name={item.icon}
        color={colors.primary}
        size={23}
        style={itemStyles.itemIcon}
      />
      <Text style={{color: colors.text, paddingLeft: 10}}>{item.title}</Text>
      <View style={{flex: 1}} />
      <Icon
        name="chevron-forward-outline"
        color={colors.primary}
        size={23}
        style={itemStyles.itemIcon}
      />
    </TouchableOpacity>
  );
}

const itemStyles = StyleSheet.create({
  listItem: {
    paddingVertical: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemIcon: {},
});
