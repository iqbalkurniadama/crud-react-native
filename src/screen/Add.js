import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      data: [],
      index: '',
      // editMode: false,
      // cari: '',
      // dataTampil: [],
    };
  }
  // membuat data
  create = text => {
    const data = this.state.data;

    data.push({item: text});

    this.setState({data, dataTampil: data});
    console.log('data', data);

    this.saveData(data);
  };

  // simpan data ke storage
  saveData = async data => {
    try {
      await AsyncStorage.setItem('@database', JSON.stringify(data));
    } catch (err) {
      console.log('save error', err);
    }
    this.setState({});
  };

  // mengambil data
  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('@database');
      value = JSON.parse(value);
      if (value !== null) {
        this.setState({data: value, dataTampil: value});
        console.log(value);
      }
    } catch (err) {
      console.log('get error', err);
    }
  };
  // untuk mengambil data saat view sudah muncul/saat dibuka
  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => this.setState({text})}
          value={this.state.text}
          placeholder="masukkan text"
        />
        {/* <TouchableOpacity
          style={{marginTop: 20}}
          onPress={() =>
            this.state.editMode ? this.edit() : this.create(this.state.text)
          }>
          <Text style={{textAlign: 'center'}}>Submit</Text>
        </TouchableOpacity> */}
        <Button
          title="Sumbit"
          onPress={() =>
            // this.state.editMode ? this.edit() : this.create(this.state.text)
            this.props.navigation.push('Home', this.create(this.state.text))
          }
        />
        {/* <View style={{marginTop: 10}}>
          <Button
            title="Kembali"
            onPress={() => this.props.navigation.goBack()}
          />
        </View> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    marginHorizontal: 20,
  },
});
export default Add;
