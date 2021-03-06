import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Linking} from 'react-native';
import Fire from '../Fire';
import * as Font from 'expo-font';


export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: false
    };
  }

  render() {

    return (
      <KeyboardAvoidingView behavior='padding' style={{flex:1}}>
        <View style={styles.container}>
          <Text style={styles.title}>après</Text>
          <View style={styles.field}>
            <Text style={styles.text}>email</Text>
            <TextInput
            returnKeyType="next"
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={email => this.setState({ email })}
          />
          </View>
          <View style={styles.field}>
            <Text style={styles.text}>password</Text>
            <TextInput
            returnKeyType="done"
            secureTextEntry
            style={styles.input}
            onChangeText={password => this.setState({ password })}
            blurOnSubmit={false}
            ref={input => (this.passwordInput = input)}
          />
          </View>
          {!!this.state.error && (
            <Text style={styles.error}> invalid login credentials </Text>
          )}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={ async() => {
              const status = await Fire.shared.login(this.state.email, this.state.password)
              if (!status) {
                this.props.navigation.navigate('ChatList')
              }
              else {
                this.setState({ error : true })
              }
            }}
          >
            <Text style={styles.buttonText}>log back in!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.eula}>
                <Text style={styles.eulaText}>By proceeding with logging in and clicking 'Log back in!', you agree to our terms as listed in our</Text>
                <Text style={styles.link}
            onPress={() => Linking.openURL('http://gist.githubusercontent.com/lisjak/5196333df14d1f708563804a885a1b66/raw/8ed9e754f8cbddd156472f02487ef8bcf4ef52ff/apres-eula')}>
        End-User License Agreement (EULA) of Après.
        </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  eula: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    textAlign: 'center',
    flex: 0,
    paddingBottom: 50,
  },
  eulaText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 1,
    fontFamily: "Futura-Light",
  },
  link: {
    color: 'blue',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
    letterSpacing: 1,
    fontFamily: "Futura-Light"
  },
  title: {
    top: 0,
    fontSize: 60,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 80,
    fontFamily: "CormorantGaramond-Light"
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 50,
    marginLeft: 50,
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10,
    flexGrow: 1,
    textAlignVertical: 'bottom',
    marginLeft: 2,
    fontFamily: "Futura-Light"
  },
  buttonContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 5,
    marginBottom: 15,
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
    fontFamily: "CormorantGaramond-Light"
  },
  error: {
    color: "red",
    fontSize: 10,
    marginBottom: 0,
    fontFamily: "Futura-Light",
    marginRight: 50,
    marginLeft: 50,
  },
  text: {
    fontFamily: "Futura-Light"
  }
});
