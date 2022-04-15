import React,{useEffect, useState, useCallback} from 'react';
import { StyleSheet,View,TouchableNativeFeedback,Image, Alert} from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates'
import { Audio } from 'expo-av';

export default function App(){

  const refresh = true

  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)

  const onDismiss = useCallback(() => {
    setVisible(false)
  },[setVisible])

  const onDismiss1 = useCallback(() => {
    setVisible1(false)
  },[setVisible1])

  async function setAlarm(timediff){
    if(timediff>0){
      let response = await fetch(`http://192.168.1.1/time?min=${timediff}`,{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6)
      {
        Alert.alert("WiFi","Connect To NodeMCU")
      }
      else
      {
        Alert.alert("Success","Alarm will go off in "+response[4]+" minutes")
      }
    }
  }

  async function setTimer(timediff){
    if(timediff>0){
    let response = await fetch(`http://192.168.1.1/SWtime?min=${timediff}`,{method: 'GET'})
    response = await response.text()
    response = response.split(',')

    if(response.length!=6)
    {
      Alert.alert("WiFi","Connect To NodeMCU")
    }
    else
    {
      Alert.alert("Success","Switch will go off in "+response[5]+" minutes")
    }
    }
    
  }

  const onConfirm = useCallback(
    ({ hours, minutes }) => {
      const now = new Date();
      const timediff = Math.floor(Math.floor((new Date(now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0')+' '+hours+':'+minutes+':00').getTime() - now) / 1000) / 60)
      setAlarm(timediff)
      setVisible(false);
    },
    [setVisible]
  );

  const onConfirm1 = useCallback(
    ({ hours, minutes }) => {
      const now = new Date();
      const timediff = Math.floor(Math.floor((new Date(now.getFullYear() + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + String(now.getDate()).padStart(2, '0')+' '+hours+':'+minutes+':00').getTime() - now) / 1000) / 60)
        setTimer(timediff)
      setVisible1(false);
    },
    [setVisible1]
  );

  const [butttonState,setButtonState] = useState({
    btn1 : true,
    btn2 : true,
    btn3 : true
  })

  const {btn1,btn2,btn3} = butttonState

  async function getState(){
    let response = await fetch('http://192.168.1.1/',{method: 'GET'})
    response = await response.text()
    response = response.split(',')
    if(response.length!=6){
      response = ['0','0','0','0','1','1']
      Alert.alert("WiFi","Connect To NodeMCU")
    }
    setButtonState({
      btn1 : response[2]=='0'?false:true,
      btn2 : response[0]=='0'?false:true,
      btn3 : response[3]=='0'?false:true
    })
  }

  async function switchLED(){
    let response
    if(btn1){
      response = await fetch('http://192.168.1.1/BToff',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    else{
      response = await fetch('http://192.168.1.1/BTon',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    setButtonState({
      btn1 : response[2]=='0'?false:true,
      btn2 : response[0]=='0'?false:true,
      btn3 : response[3]=='0'?false:true
    })
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/SwitchOn.mp3')
   );
   await sound.playAsync();
  }

  async function switchTube(){
    let response
    if(btn2){
      response = await fetch('http://192.168.1.1/TUBELIGHToff',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    else{
      response = await fetch('http://192.168.1.1/TUBELIGHTon',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    setButtonState({
      btn1 : response[2]=='0'?false:true,
      btn2 : response[0]=='0'?false:true,
      btn3 : response[3]=='0'?false:true
    })
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/SwitchOn.mp3')
   );
   await sound.playAsync();
  }

  async function switchPlug(){
    let response
    if(btn3){
      response = await fetch('http://192.168.1.1/SWoff',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    else{
      response = await fetch('http://192.168.1.1/SWon',{method: 'GET'})
      response = await response.text()
      response = response.split(',')
      if(response.length!=6){
        response = ['0','0','0','0','1','1']
        Alert.alert("WiFi","Connect To NodeMCU")
      }
    }
    setButtonState({
      btn1 : response[2]=='0'?false:true,
      btn2 : response[0]=='0'?false:true,
      btn3 : response[3]=='0'?false:true
    })
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/SwitchOn.mp3')
   );
   await sound.playAsync();
  }

  useEffect(()=>{
    getState()
  },[refresh])
  const now = new Date();
  return (

    <View style={styles.container}>

      <View style={styles.board}>
      
      <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={now.getHours()}
          minutes={now.getMinutes()}
          uppercase={false}
          cancelLabel="Cancel"
          confirmLabel="Set Alarm"
          animationType="slide"
          />
        <TimePickerModal
          visible={visible1}
          onDismiss={onDismiss1}
          onConfirm={onConfirm1}
          hours={now.getHours()}
          minutes={now.getMinutes()}
          uppercase={false}
          cancelLabel="Cancel"
          confirmLabel="Set Timer"
          animationType="slide"
          />

          <TouchableNativeFeedback onPress={switchLED}>
            {
            btn1?
            (
            <View>
              <Image source={require(`./images/switchOn.png`)} style={styles.image}/>
            </View>
            ):
            (
            <View>
              <Image source={require(`./images/switchOff.png`)} style={styles.image}/>
            </View>)
            }
          </TouchableNativeFeedback>

          <TouchableNativeFeedback onPress={()=>{setVisible(true);}}>
          <View>
          <Image
              source={require('./images/alramClock.png')}
              style={{ resizeMode: 'center' }}
          />
          </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback onPress={switchTube}>
              {
              btn2?
              (
              <View>
                <Image source={require(`./images/switchOn.png`)} style={styles.image}/>
              </View>
              ):
              (
              <View>
                <Image source={require(`./images/switchOff.png`)} style={styles.image}/>
              </View>
              )
              }
          </TouchableNativeFeedback>

          <TouchableNativeFeedback onPress={()=>{setVisible1(true);}}>
          <View>
          <Image
              source={require('./images/Timer.png')}
              style={{ resizeMode: 'center' }}
          />
          </View>
          </TouchableNativeFeedback>

          <TouchableNativeFeedback onPress={switchPlug}>
              {
              btn3?
              (
              <View>
                <Image source={require(`./images/switchOn.png`)} style={styles.image}/>
              </View>
              ):
              (
              <View>
                <Image source={require(`./images/switchOff.png`)} style={styles.image}/>
              </View>
              )
              }
          </TouchableNativeFeedback>

      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#5465FF'
  },
  board:{
    flex: 1,
    flexDirection:'row',
    width:'90%',
    maxHeight:'70%',
    borderColor:'#fff',
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#9BB1FF',
    borderRadius: 15
  },
  image: {
    borderColor:'#fff',
    borderWidth: 2,
    borderRadius: 15,
    height: '95%',
    resizeMode: 'cover',
    borderRadius : 10 
  },
});
