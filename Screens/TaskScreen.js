// To do: Make a globar 'isSignedIn' variable to be shared between documents
// Use the isSignedIn Variable to control access to pages
// Make a general layout for the task screen
// Implement feature to be able to add a task object which is then mapped out in the task screen
// Make the screen scrollable
// 

import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Flex, TouchableOpacity, FlatList,  } from 'react-native';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { authentication, db, firebase } from '../Firebase/firebase-config';
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, addDoc, query, where, deleteDoc, doc, setDoc} from 'firebase/firestore/lite';
import { FirebaseError } from 'firebase/app';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Display from 'react-native-display';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

function HomeScreen({ navigation }) {

  const [taskScreenVisible, setTaskScreenVisible] = useState(false);

  const todoRef = firebase.firestore().collection('newData');
  const [addData, setAddData] = useState('');
  let [toDos, setToDos] = useState([])

  let [isLoading, setIsLoading] = useState(true)
  let [isRefreshing, setIsRefreshing] = useState(true)

  const [selected, setSelected] = useState("")

  // Get user data from Firebase collection and load into usable array for rendering into a FlatList
  let loadTodoList = async () => {
    const q = query(collection(db, "todos"), where("userId", "==", authentication.currentUser.uid));

    const querySnapshot = await getDocs(q);
    let toDos = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      toDos.push(doc.data());

    });

    
    setToDos(toDos);
    setIsLoading(false);
    console.log("This is to dos")

  }

  if (isLoading) {
    loadTodoList();
    //console.log('This is to dos ')
  };

  let checkTodoItem = (item, isChecked) => {
    setIsLoading(true);
    loadTodoList;
    console.log('refreshed')
    deleteTodo(item.id);
  }

  let renderTodoItem = ({ item }) => {
    return (
      <View style={[styles.listContainer, {backgroundColor: '#7C7C7C'}]}>
        <BouncyCheckbox
          style={{borderRadius: 10, padding: 5}}
          isChecked={item.completed}
          size={40}
          fillColor="#07BEB8"
          unfillColor="#383D3B"
          text={item.text}
          iconStyle={{ borderColor: "#07BEB8", marginLeft: 10}}
          innerIconStyle={{ borderWidth: 2 }}
          textStyle={{ fontFamily: "SegoeBold", color: 'black'}}
          onPress={(isChecked) => { 
            checkTodoItem(item, isChecked);
            }}
        />
      </View>
    )
  }

  // Sign out the existing user and navigate back to the login screen
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
  const openAddTask = () => {
    setTaskScreenVisible(!taskScreenVisible);
    console.log('openPressed')
  }

  // Add a task to the Firebase Database connected to UserId
  let addTodo = async (text) => {
    let toDoToSave = {
      text: text,
      completed: false,
      userId: authentication.currentUser.uid,
      id: toDos.length,
    }
    const docRef = await addDoc(collection(db, "todos"), toDoToSave)

    toDoToSave.id = docRef.id;

    let updatedTodos = [...toDos];
    updatedTodos.push(toDoToSave);

    setToDos(updatedTodos);

    console.log(docRef);
    console.log('this is add data: ' + addData);
  };
  
  let deleteTodo = async (todoId) => {
    await deleteDoc(doc(db, 'todos', todoId));
    let updatedTodos = [...toDos].filter((item) => item.id != todoId);
    setToDos(updatedTodos)
  }

  let openManageScreen = () => {
    navigation.navigate('Manage Screen')
  }


  return (

    <View style={styles.container}>

      {/*-----------------------------------NAVBAR----------------------------------------------------- */}
      <View style={styles.navBar}>

        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={handleSignOutPress}
        >

          <Ionicons name='arrow-back-outline' size={40} color='#07BEB8' />

        </TouchableOpacity>

        <Text style={styles.navBarText}>Tasks</Text>

        <TouchableOpacity
        onPress={openManageScreen}>

          <Ionicons name='ellipsis-vertical-outline' size={35} color='#07BEB8' />

        </TouchableOpacity>
        
      </View>

      {/*-----------------------------------/NAVBAR----------------------------------------------------- */}
    
      <View style={styles.listContainer}>
          <FlatList 
          data={toDos}
          keyExtractor={item => item.id}
          renderItem={renderTodoItem}
          
          />
          
      </View>
      {/*-----------------------------------ADDTASKBAR----------------------------------------------------- */}

      <Display enable={taskScreenVisible} style={[styles.taskAddContainer, { backgroundColor: '#374B4A' }]}>

        <TouchableOpacity onPress={openAddTask}>
          <Ionicons name='ellipse-outline' size={40} color='gray' />
        </TouchableOpacity>

        <TextInput
          style={styles.taskTextInput}
          placeholder="Add task"
          placeholderTextColor='gray'
          value={addData}
          onChangeText={setAddData}
        />

        <TouchableOpacity onPress={() => {
          addTodo(addData);
          setAddData('');
          setTaskScreenVisible(false);
        }}>
          <Ionicons name='push-outline' size={40} color='gray' style={{ marginLeft: 35}} />
        </TouchableOpacity>
      </Display>
      <TouchableOpacity style={styles.addTaskIcon} onPress={openAddTask}>
        <Display enable={!taskScreenVisible}>

          <Ionicons name='add-circle-outline' size={80} color='#07BEB8' />

        </Display>

      </TouchableOpacity>
      {/*-----------------------------------/ADDTASKBAR----------------------------------------------------- */}


    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#383D3B', // smoky-black
    padding: 16,
  },
  navBar: {
    marginTop: 30,
    width: '100%',
    height: '5%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  navBarText: {
    marginLeft: 10,
    marginRight: '55%',
    fontSize: 30,
    fontFamily: 'Segoe',
    color: '#07BEB8',

  },
  text: {
    fontSize: 40,
    fontFamily: 'SegoeBold',
    color: '#07BEB8',
  },
  signOutButton: {
    width: '30%',
    height: '5%',
    borderRadius: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#9CEAEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#07BEB8',
    borderWidth: 2,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'SegoeBold',
  },
  addTaskIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  taskAddContainer: {
    position: 'absolute',
    //justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    bottom: 10,
    flexDirection: 'row',
    padding: 5
  },
  taskTextInput: {
    justifyContent: 'center',
    borderColor: '#07BEB8',
    backgroundColor: '#374B4A',
    width: '70%',
    height: '100%',
    color: 'white',
  },
  listContainer: {
    width: '98%',    
    marginTop: 10,
    borderRadius: 10,
    flexDirection: 'row'
  }

})