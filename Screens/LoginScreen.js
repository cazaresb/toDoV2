import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Flex, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { authentication, db } from '../Firebase/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from 'firebase/firestore/lite';
import { FirebaseError } from 'firebase/app';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

function LoginScreen({ navigation }) {

  
  // Go to main Home Screen
  const navigateToScreen = () => {

    navigation.navigate('Task Screen');

  }
  
  const [errorTextMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  // Text input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if(authentication.currentUser) {
    navigation.navigate("Task Screen")
  } else {
    onAuthStateChanged(authentication, (user) => {
      if (user) {
        navigation.navigate("Task Screen")
      } 
    });
  }


  
  // Register a user for the first time, send error message if error
  const registerUser = () => {
    createUserWithEmailAndPassword(authentication, username, password)
      .then((userCredential) => {
        const user = userCredential.user
        //console.log(re)
        navigateToScreen();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsVisible(true);
        console.log(errorCode);
        console.log(errorMessage);
        setErrorMessage(errorMessage);
      })

  };

  // Sign in user if they already have an account
  const signInUser = () => {
    signInWithEmailAndPassword(authentication, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigateToScreen();
      })
      .catch((error) => {
        setIsVisible(true);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        setErrorMessage(errorMessage);
      })

  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'>

      <Text style={styles.titleText}>
        ToDo App
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {color: 'white'}]}
          placeholder='Email'
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          style={[styles.input, {color: 'white'}]}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={signInUser}

      >
        <Text style={styles.text}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        // change back after testing done to "handleRegisterPress"
        onPress={registerUser}

      >
        <Text style={[styles.text, {color: 'white'}]}>
          Register
        </Text>
      </TouchableOpacity>

      <Dialog
        visible={isVisible}
        onTouchOutside={() => {
          setIsVisible(false)
        }}
      >
        <DialogContent>

          <Text>
            {errorTextMessage}
          </Text>

        </DialogContent>
      </Dialog>



    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#383D3B'
  },
  inputContainer: {
    width: '80%',
  },
  text: {
    fontWeight: '800',
    textAlign: 'center',
    
  },
  titleText: {
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 40,
    //fontFamily: 'Segoe',
    color: '#07BEB8',
    padding: 16
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: 'gray',
  },
  loginButton: {
    marginTop: 10,
    width: '30%',
    height: '7%',
    borderRadius: 10,
    backgroundColor: '#74B3CE',
    justifyContent: 'center',
    alignitems: 'center',
    alignSelf: 'center',
  },
  registerButton: {
    marginTop: 10,
    width: '30%',
    height: '7%',
    borderRadius: 10,
    backgroundColor: '#383D3B',
    borderColor: '#74B3CE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    alignSelf: 'center',

  }
})