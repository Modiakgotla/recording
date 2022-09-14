import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const [recording,setRecording] = React.useState();
  const [recordings,setRecordings] = React.useState([]);
  const [message,setMessage] = React.useState("");

  async function startRecording() {
    try{
      const permission = await Audio.requestPermissionAsync();

      if (permission.status === "passed") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const {recording} = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
      } else {
        setMessage("Please grant permisson")
      };
    } catch (err) {
      console.error('Failed to start',err);
    }
  }

  async function stopRecording(){

    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updateRecordings = [...recordings];
    const {sound,status} = await recording.createNewLoadedSoundAsync();
    updateRecordings.push({
      sound:sound,
      duration: getDurationFormatted(status.durationMillis),
      file:recording.getURI()
    });
    setRecording(updateRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis /1000/60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) = 60);
    const secondsDisplay = seconds <10 ? '0${seconds}' : seconds;
    return {minutesDisplay : secondsDisplay};

  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index)=>{
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording {index +1} - {recordingLine.duration}</Text>
          <Button style={styles.button} onPress={()=> recordingLine.sound.replayAsync()} title="Play"></Button>
        </View>
      )
    })
  }
  return (

    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
      title={recording ? 'Stop Recording' : 'start Recording'}
      onPress={recording ? stopRecording : startRecording} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row:{
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'center',
  },
  fill:{
    flex:1,
    margin:16
  },
  button:{
    margin: 16
  }
});
