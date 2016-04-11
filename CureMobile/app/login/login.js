import React, {
    Component,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    ActivityIndicatorIOS
} from 'react-native';
import AuthService from './authService';

const loginApi = "http://localhost:3000/api/user/log-in";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBusy: false,
            error: null
        }
    }

;

    render() {
        var errorCtrl = <View  />;
        var spinner = null;

        if (this.state.error) {
            errorCtrl =
                <View style={styles.errorContainer}><Text style={styles.errorMessage}>{this.state.error}</Text></View>
        }

        if (this.state.isBusy) {
            spinner = (<View style={styles.spinContainer}>
                <ActivityIndicatorIOS
                    style={styles.spinner}
                    animating={this.state.isBusy}
                    size="large"/>
            </View>)
        }
        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <Text style={styles.heading}>Log In</Text>
                        <TextInput
                            style={styles.input}
                            ref='EmailInputInput'
                            placeholder="Email"
                            keyboardType="email-address"
                            returnKeyType={'next'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(text) => this.setState({email: text})}
                            onSubmitEditing={() => {
                                this.refs.PasswordInput.focus();
                            }}/>
                        <TextInput
                            style={styles.input}
                            ref='PasswordInput'
                            placeholder="Password"
                            secureTextEntry={true}
                            returnKeyType={'done'}
                            onChangeText={(text) => this.setState({password: text})}
                            onSubmitEditing={this.makeCall.bind(this)}/>

                        <TouchableHighlight
                            style={styles.button}
                            onPress={this.makeCall.bind(this)}>
                            <Text style={styles.buttonText}>SUBMIT</Text>
                        </TouchableHighlight>
                        {errorCtrl}
                        {spinner}
                    </View>
                </View>
            </View>
        );
    }

    makeCall() {
        let params = {
            email: this.state.email,
            password: this.state.password
        };

        this.setState({isBusy: true});

        AuthService.login(params)
            .then(() => {
                this.setState({error: null});
                return this.props.onLogin();
            })
            .catch((error) => {
                this.setState({error: error.message})
            })
            .finally(() => {
                this.setState({isBusy: false});
            });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0'
    },
    form: {
        alignItems: 'center',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "#fff",
        padding: 10,
        marginTop: -60
    },
    heading: {
        color: "#333",
        fontSize: 28,
        fontWeight: 'bold'
    },
    input: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        color: "#656565",
        borderWidth: 1,
        borderColor: "#e6e6e6"
    },
    button: {
        height: 50,
        marginTop: 10,
        backgroundColor: "#0a85d7",
        justifyContent: 'center',
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: "#0a85d7",
        borderRadius: 3,
    },
    buttonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: "#fff",
        alignSelf: "center"
    },
    errorContainer: {
        backgroundColor: "#BD362F",
        alignSelf: "stretch",
        justifyContent: 'center',
        marginTop: 10,
        padding: 5
    },
    errorMessage: {
        color: "#fff",
        fontSize: 18
    },

    spinContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100
    },
    spinner: {
        marginRight: -18
    }
});

module.exports = Login;