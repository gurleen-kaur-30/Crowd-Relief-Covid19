import React, { Component } from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { styles } from '../../assets/styles/aboutUs_styles';
import {
  Header,
  Title,
  Left,
  Body,
  List,
  ListItem,
  Thumbnail
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  linkMap,
  projectsData,
  socialData,
} from '../../utils/aboutUtil';

/**
 * Screen showing the about us for AOSSIE
 *
 * @extends Component
 */
export default class AboutUs extends Component {
  handleGoToLink(field) {
    let url = linkMap[field] || 'https://gitlab.com/aossie';

    Linking.canOpenURL(url).then(supported => {
      supported
        ? Linking.openURL(url)
        : console.log(`Don\'t know how to open URI: ${url}`);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header style={styles.headerStyle} androidStatusBarColor='#1c76cb'>
          <Left>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => Actions.pop()}
            >
              <Icon name='angle-left' size={35} style={styles.backButtonIcon} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={styles.headerTitle}>About Us</Text>
          </Body>
        </Header>
        <ScrollView>
          <View>
            <Image
              style={styles.logo}
              resizeMethod='resize'
              source={require('../../assets/images/aossie.png')}
            />
          </View>
          <Text style={styles.title}>
            AOSSIE - Australian Open Source Software Innovation and Education
          </Text>
          <View style={styles.dividerYellow} />
          <Text style={styles.description}>
            We are an Australian not-for-profit umbrella organization for
            open-source projects. We believe the open-source philosophy provides
            a resource-efficient channel to transfer knowledge and achieve
            innovation and education.
          </Text>
          <Text style={styles.description}>
            We have a diverse group of members, including GSoC students from
            previous years who decided to become long-term contributors as well
            as academics with extensive experience in supervising undergraduate,
            M.Sc. and PhD students on thesis and projects, whose results are
            often published and presented in the most prestigious conferences of
            our research fields.
          </Text>
          <View style={styles.dividerBlue} />
          <View style={styles.projects}>
            <Text style={styles.projectsTitle}>Our Projects</Text>
          </View>
          {projectsData.map(project => {
            return (
              <List key={project.key}>
                <ListItem
                  thumbnail
                  style={styles.listItem}
                  onPress={this.handleGoToLink.bind(this, project.key)}
                >
                  <Left>
                    <Thumbnail square source={project.thumbnail} />
                  </Left>
                  <Body>
                    <Text>{project.title}</Text>
                    <Text note numberOfLines={project.lines}>
                      {project.summary}
                    </Text>
                  </Body>
                </ListItem>
              </List>
            );
          })}
          <View style={styles.space} />
          <Text style={styles.title}>
            Follow us and contribute to our projects!
          </Text>
          <View style={styles.social}>
            {socialData.map(socialItem => {
              return (
                <TouchableOpacity
                  key={socialItem.key}
                  onPress={this.handleGoToLink.bind(this, socialItem.key)}
                >
                  <Image
                    style={styles.socialItem}
                    resizeMethod='resize'
                    source={socialItem.image}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
