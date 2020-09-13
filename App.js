import React, { useState, useRef } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import axios from 'axios'

import firebase from './firebase';

/*
**
  This app will have two input boxes: (1) for the phone number; and (2) for the verification code. 
  Each with designated buttons that will execute our verification process.
**
*/
export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const recaptchaVerifier = useRef(null);

  // const getTest = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:8080/test')
  //     console.log(response)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   getTest()
  // }, [])

  // Function to be called when requesting for a verification code
  const sendVerification = () => {

    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId);
  }
  
  // Function to be called when confirming the verification code that we received
  // from Firebase via SMS
  const confirmCode = () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((result) => {
          result.user.getIdToken()
            .then(async token => {
              console.log(token)
              // fetch('http://localhost:8080/verify', {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json'
              //   },
              //   body: JSON.stringify({ token })
              // })
              const response = await axios.post('https://nameless-scrubland-96190.herokuapp.com/verify', { token })
              console.log(response.data)
            })
            .catch(error => console.log(error))

        // Make Ajax call to server w token
      });

  }

  return (
    <View style = { styles.container }>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />

      <TextInput
        placeholder="Phone Number"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
      />

      <TouchableOpacity onPress={sendVerification}>
        <Text>Send Verification</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Confirmation Code"
        onChangeText={setCode}
        keyboardType="number-pad"
      />

      <TouchableOpacity onPress={confirmCode}>
        <Text>Confirm Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})



