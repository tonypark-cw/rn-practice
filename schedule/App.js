import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@projects";

export default function App() {

  const [ismain, setIsmain] = useState(true);
  const [projects, setProjects] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const mainProject = () => setIsmain(true);
  const sideProject = () => setIsmain(false);
  const onChangeText = (payload) => setText(payload);
  const saveProjects = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadProjects = async () => {
    const str = await AsyncStorage.getItem(STORAGE_KEY);
    setProjects(JSON.parse(str));
  };

  const addPrj = async () => {
    if (text === ""){
      return;
    }

    const datas = {...projects, [Date.now()] : {text, ismain:ismain}}
    setProjects(datas);
    await saveProjects(datas);
    setText("");
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={mainProject}>
          <Text style={{...styles.btnMain, color: ismain ? "white" : "grey"}}>Main</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sideProject}>
          <Text style={{...styles.btnSide, color: ismain ? "grey" : "white"}}>Side</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          onSubmitEditing={addPrj}
          style={styles.input} 
          placeholder={ismain ? "Add Main Project" : "Add Side Project"}
          onChangeText={onChangeText}
        ></TextInput>
      </View>
      <ScrollView>
        {Object.keys(projects).map(key => (
          projects[key].ismain === ismain ? (
            <View key={key} style={{...styles.prj, backgroundColor : ismain ? "tomato" : "wheat"}}>
              <Text style={{...styles.prjtext,color:ismain ? "white" : "black"}}>{projects[key].text}</Text>
            </View>
            ) : null))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"black",
    paddingHorizontal:20
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnMain:{
    fontSize:35,
    paddingHorizontal:20,
  },
  btnSide:{
    fontSize:35,
    paddingHorizontal:20,
  },
  input:{
    backgroundColor:"white",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:7,
    marginVertical:20,
    fontSize:18,
  },
  prj:{
    color: "white",
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:20,
    borderRadius:7,
    fontSize:16,
  },
  prjtext:{
    fontSize: 16,
    fontWeight: "500",
  },
});
