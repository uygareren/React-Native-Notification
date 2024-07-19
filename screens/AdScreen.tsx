import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdScreen(){

    const navigation = useNavigation<any>();

    return(
        <View>
            <TouchableOpacity onPress={() => navigation.navigate("AdDetail", {id:5})}>
                <Text>
                    Ad Detail'e Git
                </Text>
            </TouchableOpacity>
        </View>
    )
}