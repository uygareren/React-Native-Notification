import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen(){

    const navigation = useNavigation<any>();


    return(
        <View>
        <TouchableOpacity onPress={() => navigation.navigate("Ad")}>
            <Text>Ad'e Git</Text>
        </TouchableOpacity>
    </View>
    )
}