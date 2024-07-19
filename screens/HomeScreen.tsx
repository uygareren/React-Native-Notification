import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function HomeScreen(){

    const navigation = useNavigation<any>();

    return(
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Text>Home</Text>
            </TouchableOpacity>
        </View>
    )
}