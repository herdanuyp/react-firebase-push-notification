import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Message
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import ResetWorld from "../assets/images/reset-world.jpg";
import usePushNotifications from "../usePushNotification";

const Error = ({ error }) =>
  error ? (
    <section className="app-error">
      <h2>{error.name}</h2>
      <p>Error message : {error.message}</p>
      <p>Error code : {error.code}</p>
    </section>
  ) : null;

const Loading = ({ loading }) =>
  loading ? (
    <div className="app-loader">Please wait, we are loading something...</div>
  ) : null;

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
  const isSSR = typeof window === "undefined";

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

/* eslint-disable react/no-multi-comp */
/* Heads up! HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled components for
 * such things.
 */
const HomepageHeading = ({ mobile }) => {
  const {
    userConsent,
    onClickSendNotifiationFCM,
    pushNotificationSupported,
    onClickAskUserPermission,
    userSubscription,
    // onClickSusbribeToPushNotification,
    // pushServerSubscriptionId,
    // onClickSendSubscriptionToPushServer,
    // onClickSendNotification,
    error,
    loading
  } = usePushNotifications();

  const isConsentGranted = userConsent === "granted";
  return (
    <Container text>
      <Loading loading={loading} />
      <Error error={error} />
      <Message negative={!pushNotificationSupported && "NOT" ? true : false}>
        <p>
          Push notification are {!pushNotificationSupported && "NOT"} supported
          by your device.
        </p>
      </Message>
      <p></p>

      <Header
        as="h1"
        content="Web Push Notification Demo"
        inverted
        style={{
          fontSize: mobile ? "2em" : "4em",
          fontWeight: "normal",
          marginBottom: 0,
          marginTop: mobile ? "1.5em" : "2em"
        }}
      />
      <Header
        as="h2"
        content="Using Firebase Cloud Messaging"
        inverted
        style={{
          fontSize: mobile ? "1.5em" : "1.7em",
          fontWeight: "normal",
          marginTop: mobile ? "0.5em" : "1.5em"
        }}
      />
      <Header
        as="h4"
        content={`User seems like ${userConsent} to get push notifications.`}
        inverted
        style={{
          fontSize: mobile ? "1.5em" : "1.7em",
          fontWeight: "normal",
          marginTop: mobile ? "0.5em" : "1.5em"
        }}
      />
      <Button
        animated="fade"
        primary
        size="huge"
        disabled={!pushNotificationSupported || isConsentGranted}
        onClick={onClickAskUserPermission}
      >
        <Button.Content visible>Give Permission</Button.Content>
        <Button.Content hidden>
          <Icon name="hand peace outline" />
        </Button.Content>
      </Button>

      <Button
        animated="fade"
        primary
        size="huge"
        disabled={!pushNotificationSupported || !isConsentGranted}
        onClick={onClickSendNotifiationFCM}
      >
        <Button.Content visible>Try now to send notification</Button.Content>
        <Button.Content hidden>
          <Icon name="hand peace outline" />
        </Button.Content>
      </Button>
    </Container>
  );
};

HomepageHeading.propTypes = {
  mobile: PropTypes.bool
};

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 700, padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item>
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/maps">Google Maps</Link>
                </Menu.Item>
                {/* <Menu.Item position="right">
                  <Button as="a" inverted={!fixed}>
                    Log in
                  </Button>
                  <Button
                    as="a"
                    inverted={!fixed}
                    primary={fixed}
                    style={{ marginLeft: "0.5em" }}
                  >
                    Sign Up
                  </Button>
                </Menu.Item> */}
              </Container>
            </Menu>
            <HomepageHeading />
          </Segment>
        </Visibility>

        {children}
      </Responsive>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation="push"
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/maps">Google Maps</Link>
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 350, padding: "1em 0em" }}
            vertical
          >
            {/* <Container>
              <Menu inverted pointing secondary size="large">
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  <Button as="a" inverted>
                    Log in
                  </Button>
                  <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                    Sign Up
                  </Button>
                </Menu.Item>
              </Menu>
            </Container> */}
            <HomepageHeading mobile />
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Responsive>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node
};

const ResponsiveContainer = ({ children }) => (
  <div>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </div>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node
};

const HomepageLayout = () => {
  return (
    <ResponsiveContainer>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={8}>
              <Header as="h3" style={{ fontSize: "2em" }}>
                Hei, Welcome Learner!
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                This is still on going website. We gonna try using Firebase and
                Just Service Worker/PWA to create push notification. So, stay
                tuned.
              </p>
            </Grid.Column>
            <Grid.Column floated="right" width={6}>
              <Image bordered rounded size="large" src={ResetWorld} />
              {/* <small>Photo by Jose Antonio Gallego Vázquez on Unsplash</small> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "0em" }} vertical>
        <Grid celled="internally" columns="equal" stackable>
          <Grid.Row textAlign="center">
            <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
              <Header as="h3" style={{ fontSize: "2em" }}>
                "Let's Collaborate"
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                Hei, what's better than working together!
              </p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: "5em", paddingTop: "5em" }}>
              <Header as="h3" style={{ fontSize: "2em" }}>
                "Spread The Code!"
              </Header>
              <p style={{ fontSize: "1.33em" }}>
                And also the love <Icon color="pink" name="like" />
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment style={{ padding: "8em 0em" }} vertical>
        <Container text>
          <Header as="h3" style={{ fontSize: "2em" }}>
            Firebase Cloud Messaging (FCM) is a cross-platform messaging
            solution that lets you reliably deliver messages at no cost.
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            Using FCM, you can notify a client app that new email or other data
            is available to sync. You can send notification messages to drive
            user re-engagement and retention. For use cases such as instant
            messaging, a message can transfer a payload of up to 4KB to a client
            app.
          </p>
          <Button
            as="a"
            href="https://developers.google.com/cloud-messaging/android/android-migrate-fcm"
            size="large"
          >
            Read More
          </Button>
          <Divider
            as="h4"
            className="header"
            horizontal
            style={{ margin: "3em 0em", textTransform: "uppercase" }}
          >
            {/* <a href="#">Case Studies</a> */}
          </Divider>
          <Header as="h3" style={{ fontSize: "2em" }}>
            Introduction to Push Notifications
          </Header>
          <p style={{ fontSize: "1.33em" }}>
            A notification is a message that pops up on the user's device.
            Notifications can be triggered locally by an open application, or
            they can be "pushed" from the server to the user even when the app
            is not running. They allow your users to opt-in to timely updates
            and allow you to effectively re-engage users with customized
            content.
          </p>
          <p style={{ fontSize: "1.33em" }}>
            Push Notifications are assembled using two APIs: the Notifications
            API and the Push API. The Notifications API lets the app display
            system notifications to the user. The Push API allows a service
            worker to handle Push Messages from a server, even while the app is
            not active.
          </p>
          <Button
            as="a"
            href="https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications"
            size="large"
          >
            I'm Still Quite Interested
          </Button>
        </Container>
      </Segment>
      <Segment inverted vertical style={{ padding: "5em 0em" }}>
        <Container>
          <Grid columns={3} divided inverted stackable>
            <Grid.Row>
              <Grid.Column>
                <Header inverted as="h4" content="About" />
                <List link inverted>
                  <List.Item as="a" href="https://github.com/herdanuyp">
                    GitHub
                  </List.Item>
                  <List.Item as="a" href="https://herdanuyp.com">
                    Contact Us
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <Header inverted as="h4" content="Services" />
                <List link inverted>
                  <List.Item as="a">Beaches</List.Item>
                  <List.Item as="a">Mountains</List.Item>
                  <List.Item as="a">One Punch Man</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
                <Header as="h4" inverted>
                  Hayepe
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </ResponsiveContainer>
  );
};
export default HomepageLayout;
