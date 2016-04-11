/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS
} from 'react-native';
import Login from './app/login/login';
import AuthService from './app/login/authService';

class CureMobile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkingAuth: true,
            isLoggedOn: false
        };
    }

    componentDidMount() {
        AuthService.getLoginStatus((err, authInfo) => {
            this.setState(({
                checkingAuth: false,
                isLoggedOn: authInfo != null
            }))
        });
    }

    render() {
        if (this.state.checkingAuth) {
            return (
                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        animating={true}
                        size="large"/>
                </View>
            )
        }

        if (this.state.isLoggedOn){
            return (
                <View style={styles.container}>
                    <Text>Logged In!</Text>
                </View>
            )
        } else {
            return (
                <Login onLogin={this.onLogin.bind(this)}/>
            );
        }
    }

    onLogin() {
        this.setState({isLoggedOn: true});
    }
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0'
    }
});

AppRegistry.registerComponent('CureMobile', () => CureMobile);
