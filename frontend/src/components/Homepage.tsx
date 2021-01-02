import React, { Component } from "react";
import PropTypes from "prop-types";
import axios, { /*AxiosInstance,*/ AxiosResponse, /*AxiosRequestConfig*/ } from 'axios';
import Header from "./Header";
import { User } from './../types'
import { Tester } from './Tester'

interface successResponse {
  success?: boolean
  message?: string
  user: User
  cookies?: any
}

interface state {
  user: User
  error: string | null
  authenticated: boolean
  photoUrl?: string | null
}

export default class HomePage extends Component<{}, state> {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      profileImageUrl: PropTypes.string,
      twitterId: PropTypes.string,
      screenName: PropTypes.string,
      _id: PropTypes.string
    })
  };

  state: state = {
    user: {},
    error: null,
    authenticated: false,
    photoUrl: null
  };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    axios.get("http://localhost:8080/auth/login/success", {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    .then((response: AxiosResponse<successResponse>) => {
      if (response.status === 200) return response.data;
      throw new Error("failed to authenticate user");
    })
    .then(responseJson => {        
      this.setState({
        authenticated: true,
        user: responseJson.user
      });
      this.setState({
        photoUrl: this.state.user.images ? this.state.user.images[0].url : null
      });
      console.log(this.state)
    })
    .catch(error => {
      this.setState({
        authenticated: false,
        error: "Failed to authenticate user"
      });
    });
  }



  render() {
    const { authenticated } = this.state;
    return (
      <div>
        <Header
          authenticated={authenticated}
          handleNotAuthenticated={this._handleNotAuthenticated}
          photoUrl={this.state.photoUrl}
        />
        <div>
          {!authenticated ? (
            <h1>Welcome!</h1>
          ) : (
            <div>
              <h1>You have login successfully!</h1>
              <h2>Welcome {this.state.user.display_name}!</h2>
            </div>
          )}
        </div>
        <Tester />
      </div>
    );
  }
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}
