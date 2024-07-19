import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Text, View } from "react-native";

export default function AdDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id }:any = route.params;

  return (
    <View>
      <Text>{id}</Text>
      {/* Örnek olarak geri dönme düğmesi */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
