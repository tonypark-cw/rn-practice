import React, { useState, useEffect } from 'react';
import {ActivityIndicator, View,Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 
import * as Location from 'expo-location';

const {width:SCREEN_WIDTH} = Dimensions.get("window");
const WEATHER_API_KEY = "e7bb455d981dd2dca606f95c26b6f7cf";

const icons = {
  Clouds:"cloudy",
  Clear:"day-sunny",
  Rain:"rains",
  Snow:"snows",
  Drizzle:"rain",
  Thunderstorm:"lightnings",
  Atmosphere:"cloudy-gusts",
}


export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);

  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }

    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${WEATHER_API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
    // console.log(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{region}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.weather}
      >
        {days.length == 0 ? (
          <View style={{...styles.day, alignItems:"center"}}>
            <ActivityIndicator color="white" size="large" style={{marginTop:10}} />
          </View>
        ) : (
          days.map((days, index) => 
          <View key={index} style={styles.day}>
            
            <Text style={{...styles.date, textAlign:"center",}}>{new Date(days.dt * 1000).toString().substring(0, 10)}</Text>
            <View style={{flexDirection:"row", alignItems:"center",width: "90%",
                  justifyContent: "space-between",}}>
              <Text style={styles.temp}>{parseFloat(days.temp.day).toFixed(1)}</Text>
              <Fontisto name={icons[days.weather[0].main]} size={65} color="white" />
            </View>
            <Text style={styles.desc}>{days.weather[0].main}</Text>
            <Text style={styles.smalldesc}>[{days.weather[0].description}]</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"tomato",
  },
  city:{
    flex: 1.2,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName:{
    fontSize:68,
    color: "wheat",
    fontWeight:"700",
  },
  day:{
    width: SCREEN_WIDTH,
  },
  date:{
    color: "white",
    fontSize:55,
  },
  temp:{
    color: "white",
    fontSize:95,
    marginLeft:20,
  },
  desc:{
    color: "white",
    fontSize:33,
    marginTop:-20,
    marginLeft:20,
  },
  smalldesc:{
    fontSize:17,
    color: "white",
    marginLeft:20,
    marginTop:-10,
  },
});
