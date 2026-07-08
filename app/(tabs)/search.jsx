import { StyleSheet, Text, View,TextInput,Pressable,FlatList } from 'react-native';
import {Colors} from '../constants/colors';
import { useState } from 'react';
import {Ionicons} from '@expo/vector-icons'
import {searchYT} from '../apis/ytv3';
import ScreenSong from '../components/screenSong'

const search = () => {

  const [query,setQuery] = useState("")
  const [songs,setSongs] = useState([])
  
 
  async function ytSearcher(){
    if(query.length === 0) return
    try{
      const res = await searchYT(query,4)
      setSongs(res)

      // console.log(JSON.stringify(res, null, 2));
    }
    catch(e){
      console.log("YT error: ",e.message)
    }
    
  }


  return (
    <View style={styles.view}>
      
      <View style={styles.searchBar}>
        <TextInput 
          style ={styles.sinput}
          placeholder="Search a song..."
          placeholderTextColor="#3a3a3bff" 
          value={query}
          onChangeText={setQuery} />
        
        <Pressable title="clear"
          onPress={() =>{
            if(query.length>0){
              setQuery("")
              setSongs([])
            }
          }} 
          style={styles.cbtn}>
            {query.length>0 && <Ionicons name="close-circle" size={20} color="white"/>}

        </Pressable>

        <Pressable title="search"
          onPress={() =>{ytSearcher()}}
          style={styles.sbtn}>

          <Ionicons name="search" size={26} color={Colors.red} /> 
        </Pressable>
      </View>

      <FlatList 
      data={songs}
      keyExtractor={(item) =>item.videoId} 
      renderItem={({item}) =>(
        <ScreenSong thumbnail={item.thumbnail} name={item.title} vid={item.videoId} />
      )} />
      
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  view:{
    flex:1,
    alignItems:'center',
    backgroundColor:Colors.bgc

  },
  text:{
    color:'white'
  },
  sinput:{
    color:Colors.text,
    height:50,
    width:290,
    backgroundColor:Colors.rbgc,
    borderBottomLeftRadius:30,
    borderTopLeftRadius:30,
    paddingLeft:30,
    alignItems:"center"
  },
  searchBar:{
    display: "flex",
    flexDirection: "row",
    marginTop:50,
    borderRadius:10,
  },
  sbtn:{
    height:51,
    width:60,
    backgroundColor:Colors.rbgc,
    borderBottomRightRadius:30,
    borderTopRightRadius:30,
    padding:10,
  },
  cbtn:{
    width:20,
    backgroundColor:Colors.rbgc,
    flexDirection:"column",
    justifyContent:"center",
  }
});

