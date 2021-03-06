import React, { Component } from 'react';
import { navigate } from 'gatsby';

import { withFirebase } from '../../../../utils/Firebase';
import { HOME } from '../../../../constants/routes';
import { FaFacebookF } from 'react-icons/fa';

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFacebook extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: {},
        });
      })
      .then(() => {
        this.setState({ error: null });
        navigate(HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  render() {
    const { error } = this.state;

    return (
      <form
        className="login__content__providers__item login__content__providers__item--facebook"
        onSubmit={this.onSubmit}
      >
        <button type="submit">
          <FaFacebookF />
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(SignInFacebook);
