import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { MaterialIndicator } from 'react-native-indicators';
import { MaterialIcons } from '@expo/vector-icons';
import SlackMessage from './SlackMessage'
import Fire from '../Fire';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default class ChatRoom extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      room: this.props.navigation.state.params.chatroom,
      messages: [],
      user: {
        name: Fire.shared.username(),
        _id: Fire.shared.uid(),
      },
      loadEarlier: true
    };
  }


  componentDidMount = () => {

    //get messages for chatroom
    Fire.shared.on(this.state.room, (message => {
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    }));

    setTimeout(() => {
      Fire.shared.enterRoom(this.state.room)
    }, 1500);
  }

  componentWillUnmount = () => {
    Fire.shared.leaveRoom(this.state.room)
    Fire.shared.off();
  }

  renderMessage(props) {
    const {
      currentMessage: { text: currText },
    } = props

    let messageTextStyle
    return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  }

  // load earlier messages from backend
  loadEarlier = async () => {

    this.setState( {isLoading : true})

    const newMessages = []

    for (let i = 0 ; i < 10; i ++) {
      await Fire.shared.loadEarlier(this.state.room, this.state.messages[this.state.messages.length-1], (message => {
        newMessages.push(message)
      }))

      this.setState(previousState => ({
        messages: GiftedChat.prepend(previousState.messages, newMessages.pop()),
      }))

    }

    this.setState( {isLoading : false})
  }

  // returns true if a user has scrolled to the top of all messages, false otherwise
  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 80;
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
  }


  uploadImage = async() => {

    // get permission to access camera roll
    await Permissions.askAsync(Permissions.CAMERA_ROLL)

    // grab picture
    const image = await ImagePicker.launchImageLibraryAsync({base64:true, quality:0})

    // send to database
    if (image) {
      Fire.shared.sendImage(image, this.state.room)
    }
  }

  // renderChatFooter = () => {
  //   return (
  //     <TouchableOpacity style={styles.chatFooter} onPress={() => this.uploadImage()}>
  //       <MaterialIcons name='photo' color='grey' size={30}></MaterialIcons>
  //     </TouchableOpacity>
  //   )
  // }

  render() {

    return (
      <View style={styles.container}>
        <View style={{flex: 1, marginBottom: 40}}>
          <Text style={styles.title}># {this.state.room}</Text>
          <Text style = {styles.tips}>Welcome to #{this.state.room}. React to posts by longpressing icons beneath messages. Press the flag icon to flag abusive messages, and press the block icon to block abusive users. Swipe right to return to the home screen.</Text>
            <GiftedChat
              messages={this.state.messages}
              listViewProps={{
                scrollEventThrottle: 400,
                onScroll: ({ nativeEvent }) => {
                  if (this.isCloseToTop(nativeEvent) && !this.state.isLoading) {
                    this.setState({isLoading: true});
                    this.loadEarlier();
                  }
                },
                navigation: this.props.navigation
              }}
              onSend={(messages) => Fire.shared.send(messages, this.state.room)}
              user={this.state.user}
              renderMessage={this.renderMessage}
              renderAvatar={null}
              sendImage={this.sendImage}
              renderLoading={() =>  <MaterialIndicator color='black' />}
              // renderChatFooter={this.renderChatFooter}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    top: 10,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 20,
    fontFamily: "CormorantGaramond-Light",
  },
  tips: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 5,
    fontFamily: "Futura-Light",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  chatFooter: {
    borderTopColor: 'black',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end'
  }
});
