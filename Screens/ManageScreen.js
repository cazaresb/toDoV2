import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Flex, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { authentication, db, firebase } from '../Firebase/firebase-config';
import { getAuth, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
import Ionicons from '@expo/vector-icons/Ionicons';
//import { toDosExport } from './TaskScreen';



function ManageScreen({ navigation }) {

    let [toDos, setTodos] = useState();

    onAuthStateChanged(authentication, (user) => {
        if (user) {
            const uid = user.uid;
        } else {
            // User is signed out
            // ...
            //navigation.navigate("Login")
        }
    });

    let deleteCurrentUser = () => {
        const user = authentication.currentUser;
    deleteUser(user).then(() => {
        // User deleted.
        navigation.navigate('Login')
        console.log('deleted')
    }).catch((error) => {
        // An error ocurred
        // ...
        console.log('failed')
    });
    }
    


    const handleSignOutPress = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("success");
        })
            .catch((error) => {
                console.log(error);
            })
        navigation.navigate('Login');
    }
    let navigateTaskScreen = () => {
        navigation.navigate("Task Screen")
    }

    return (
        <View style={styles.container}>

            <View style={styles.navBar}>

                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={navigateTaskScreen}
                >

                    <Ionicons name='arrow-back-outline' size={40} color='#07BEB8' />

                </TouchableOpacity>

                <Text style={styles.navBarText}>Manage</Text>

            </View>

            <View style={styles.bodyContainer}>
                <TouchableOpacity style={styles.textWrapContainer}
                onPress={deleteCurrentUser}>
                    <Text style={styles.text}>Delete account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textWrapContainer}
                >
                    <Text style={styles.text}>Delete all tasks</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textWrapContainer}
                    onPress={handleSignOutPress}>
                    <Text style={styles.text}>Sign out</Text>
                </TouchableOpacity>

            </View>



        </View>
    )
}

export default ManageScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        //justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#383D3B',

    },
    navBar: {
        marginTop: 30,
        width: '100%',
        height: '5%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBarText: {
        marginLeft: 10,
        marginRight: '55%',
        fontSize: 30,
        fontFamily: 'Segoe',
        color: '#07BEB8',

    },
    bodyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '90%',
        padding: 16,
    },
    text: {
        fontSize: 25,
        fontFamily: 'SegoeBold',
        color: '#9CEAEF',
        marginTop: 10,
        textAlign: 'center'

    },
    textWrapContainer: {
        borderWidth: 2,
        padding: 7,
        backgroundColor: '#3AA0C2',
        borderColor: '#07BEB8',
        borderRadius: 5,
        width: '70%',
        marginTop: 5
    }
})