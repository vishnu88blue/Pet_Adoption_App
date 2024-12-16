import { StyleSheet, Text, View, Image,TouchableOpacity,  } from 'react-native'
import React, {useCallback}from 'react'
import * as WebBrowser from 'expo-web-browser'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

const index = () => {
  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [])
  return  (
    <View style={styles.container}>
      

      <Image source={require('./../../assets/images/landingimage.png')} style={styles.image}>
      </Image>
      <Text style={styles.text}>"Find your perfect furry friend - log in to start your adoption journey!"</Text>

      <TouchableOpacity style={styles.button} onPress={onPress} 
          > 
        <Text style={styles.textbutton}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCC737',
    marginTop:40,
    alignItems: 'center',
  },
  image:{
    width: '100%',
    height: '60%',
    
    },
    button:{
      backgroundColor: '#E73879',
      justifyContent: 'center',
      borderRadius: 10,
      margin: 20,
      width: '24%',
      height: '8%',
    },
  text: {
    marginTop:20,
    fontSize: 30,
    marginBottom: 40,
    marginHorizontal: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#7E1891'
  },
  textbutton:{
    fontSize: 25,
    color: 'black',
    fontWeight:'500',
    textAlign: 'center'
  },
  

});


export default index

