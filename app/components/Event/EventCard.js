import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Card, Icon } from 'react-native-elements';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../../../config';
import styles from '../styles/main';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

let deviceHeight= Dimensions.get('window').height;

const returnAnnotation = (coords) => {
  return (
    <Mapbox.PointAnnotation
      key={"2"}
      id={"2"}
      coordinate={[coords.longitude, coords.latitude]}
      title="annotation title"
    >
    </Mapbox.PointAnnotation>
  )
}

export default function EventCard(props) {
  return (
    <Card
      containerStyle={styles.cardContainer}
    >
      <View style={styles.spaceBetweenRow}>
        <Icon
          name='ios-settings'
          color='#3578E5'
          type='ionicon'
          size={40}
        />
        <Icon
          name='ios-time'
          color='#3578E5'
          type='ionicon'
          size={40}
        />
      </View>
      <View style={[styles.spaceBetweenRow,{marginBottom: 30}]}>
        <Text style={styles.text}>{props.event.type}</Text>
        <Text style={styles.text}>{props.event.date}</Text>
      </View>
      <View style={styles.spaceBetweenRow}>
        <Icon
          name='ios-people'
          color='#3578E5'
          type='ionicon'
          size={40}
        />
        <Icon
          name='ios-text'
          color='#3578E5'
          type='ionicon'
          size={40}
        />
      </View>
      <View style={[styles.spaceBetweenRow,{marginBottom: 30}]}>
        <View style={{flexDirection: 'row',justifyContent: 'flex-start'}}>
          {props.event.participants.map((p,i) => {
            return (
              <Avatar
                size='small'
                rounded
                source={{uri: p.photoURL}}
                activeOpacity={0.7}
                containerStyle={{margin: 5}}
                key={i}
              />
            )
          })}
        </View>
        <View>
          <Text style={styles.text}>{props.event.comment}</Text>
        </View>
      </View>

      <Text style={[styles.text, {alignSelf: 'center'}]}>{props.event.court.name}</Text>

      <TouchableOpacity
        style={[styles.spaceBetweenRow,{height: deviceHeight*.20}]}
        onPress= {() => { // navigate to this court in the Explore screen
          props.onClose(false)
          props.navigation.navigate('Explore', { action: {type: 'showCourt', data: props.event.court} })
        }}
      >
        <Mapbox.MapView
          styleURL={Mapbox.StyleURL.Light}
          zoomLevel={15}
          centerCoordinate={[props.event.court.coords.longitude, props.event.court.coords.latitude]}
          showUserLocation={false}
          style={{flex: 1}}
          logoEnabled={false}
        >
          {returnAnnotation({latitude: props.event.court.coords.latitude, longitude: props.event.court.coords.longitude})}
        </Mapbox.MapView>
      </TouchableOpacity>

    </Card>
  )
}