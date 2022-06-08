import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      data: [],
      index: '',
      editMode: false,
      cari: '',
      dataTampil: [],
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

  // edit data
  edit = () => {
    const data = this.state.data;

    data[this.state.index].item = this.state.text;
    this.setState({data, editMode: false, text: '', dataTampil: data});
    this.saveData(data);
  };

  // delete data
  delete = () => {
    const data = this.state.data;

    data.splice(this.state.index, 1);
    this.setState({data, dataTampil: data});
    this.saveData(data);
  };

  // cari data
  cari = () => {
    let data = this.state.data;

    data = data.filter(item =>
      item.item.toLowerCase().includes(this.state.cari.toLowerCase()),
    );
    this.setState({dataTampil: data});
  };

  networking = () => {
    return fetch('192.168.56.1:3000/posts')
      .then(response => response.json())
      .then(json => {
        return json.item;
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {/* navigasi */}

        <Button
          title="Tambah"
          onPress={() => this.props.navigation.navigate('Add')}
        />

        <TextInput
          style={styles.textInput}
          onChangeText={text => this.setState({text})}
          value={this.state.text}
          placeholder="Edit text"
        />
        <TouchableOpacity
          style={{marginTop: 20, marginBottom: 20}}
          onPress={() =>
            this.state.editMode ? this.edit() : this.create(this.state.text)
          }>
          <Text style={{textAlign: 'center'}}>Submit</Text>
        </TouchableOpacity>

        {/* search */}
        <TextInput
          style={styles.textInput}
          onChangeText={text => this.setState({cari: text}, () => this.cari())}
          value={this.state.cari}
          placeholder="masukkan Pencarian"
        />

        <FlatList
          style={{padding: 10, backgroundColor: '#ced6e0'}}
          data={this.state.dataTampil}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.flatlist}
              onPress={() =>
                this.setState({text: item.item, index, editMode: true})
              }>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={{color: '#000', fontSize: 18}}>
                    {index}. {item.item}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'crimson',
                    paddingHorizontal: 10,
                    borderRadius: 8,
                  }}
                  onPress={() => this.setState({index}, () => this.delete())}>
                  <Text style={{color: '#FFF', fontSize: 18}}> X </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
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
  flatlist: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#2ed573',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
  },
});

export default Home;
