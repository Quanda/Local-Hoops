import firebase from 'react-native-firebase'
import { displayError } from './Misc';

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const updateStatus = (status) => ({
  type: UPDATE_STATUS,
  status
})
export const UPDATE_FRIENDS = 'UPDATE_FRIENDS';
export const updateFriends = (friend) => ({
  type: UPDATE_FRIENDS,
  friend
})
export const UPDATE_PREFERRED_MAPTYPE = 'UPDATE_PREFERRED_MAPTYPE';
export const updatePreferredMapType = (preferredMapType) => ({
  type: UPDATE_PREFERRED_MAPTYPE,
  preferredMapType
})
export const ADD_FRIEND_REQUEST = 'ADD_FRIEND_REQUEST';
export const addFriendRequest = () => ({
  type: ADD_FRIEND_REQUEST
})
export const ADD_FRIEND_SUCCESS = 'ADD_FRIEND_SUCCESS';
export const addFriendSuccess = (friendId) => ({
  type: ADD_FRIEND_SUCCESS,
  friendId
})
export const ADD_FRIEND_ERROR = 'ADD_FRIEND_ERROR';
export const addFriendError = (error) => ({
  type: ADD_FRIEND_ERROR,
  error
})
export const REMOVE_FRIEND_REQUEST = 'REMOVE_FRIEND_REQUEST';
export const removeFriendRequest = () => ({
  type: REMOVE_FRIEND_REQUEST
})
export const REMOVE_FRIEND_SUCCESS = 'REMOVE_FRIEND_SUCCESS';
export const removeFriendSuccess = (friendId) => ({
  type: REMOVE_FRIEND_SUCCESS,
  friendId
})
export const REMOVE_FRIEND_ERROR = 'REMOVE_FRIEND_ERROR';
export const removeFriendError = (error) => ({
  type: REMOVE_FRIEND_ERROR,
  error
})
export const UPDATE_FR_RECEIVED = 'UPDATE_FR_RECEIVED';
export const updateFriendRequestsReceived = (friendRequestsReceived) => ({
  type: UPDATE_FR_RECEIVED,
  friendRequestsReceived
})
export const UPDATE_FR_SENT = 'UPDATE_FR_SENT';
export const updateFriendRequestsSent= (friendRequestsSent) => ({
  type: UPDATE_FR_SENT,
  friendRequestsSent
})

// Send friend request
export const sendFriendRequest = (userId, prospectiveFriendId) => (dispatch) => {

  // first check if a friend request document already exists
  firebase.firestore().collection(`friendRequests`)
    .where("requesteeId", "==", userId)
    .where("requestorId", "==", prospectiveFriendId)
    .get()
    .then(doc => {
      if(doc.empty) {
        firebase.firestore().collection(`friendRequests`)
          .where("requesteeId", "==", prospectiveFriendId)
          .where("requestorId", "==", userId)
          .get()
          .then(doc => {
            if(doc.empty) {
              // no friend request exists yet
              firebase.firestore().collection('friendRequests')
                .add({
                  requestorId: userId,
                  requesteeId: prospectiveFriendId,
                  status: 'pending'
                })
            } else {
              dispatch(addFriendError({message: `A friend request already exists`}));
            }
          })
          .catch( () => {
            dispatch(displayError({message: 'Sorry, there was a problem sending the friend request'}))
          })
      } else {
        dispatch(addFriendError({message: `A friend request already exists`}));
      }
    })
}

// Add friend
export const createFriends = (requesteeId, requestorId) => (dispatch) => {

  // add users to each others friends array
  firebase.firestore().doc(`users/${requesteeId}`)
    .update({
      friends: firebase.firestore.FieldValue.arrayUnion(requestorId)
    })
    .then(() => {
      firebase.firestore().doc(`users/${requestorId}`)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion(requesteeId)
        })
    })
    // update status of document in friendRequests collection
  firebase.firestore().collection('friendRequests')
    .where('requesteeId', '==', requesteeId)
    .where('requestorId', '==', requestorId)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          status: 'accepted'
        })
      })
    })
    .catch( () => {
      dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
    })
}

export const cancelFriendRequest = (requesteeId, requestorId) => (dispatch) => {

  // delete document from friendRequests collection
  firebase.firestore().collection('friendRequests')
    .where('requesteeId', '==', requesteeId)
    .where('requestorId', '==', requestorId)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          status: 'declined'
        })
      })
    })
    .catch( () => {
      dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
    })
}

// Remove friend
export const removeFriend = (userId, friendId) => (dispatch, getState) => {
  dispatch(removeFriendRequest());

  firebase.firestore().doc(`users/${userId}`)
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove(friendId)
    })
    .then(() => {
      firebase.firestore().doc(`users/${friendId}`)
        .update({
          friends: firebase.firestore.FieldValue.arrayRemove(userId)
        })
    })
    .then(() => {
      dispatch(removeFriendSuccess(friendId));
      dispatch(getFriends(getState().currentUser.friends));
    })
    .catch( () => {
      dispatch(removeFriendError());
    });
}

// Get Friends
export const getFriends = (friendIds) => (dispatch, getState) => {
  friendIds.forEach(uid => {
    firebase.firestore().collection('users').doc(uid)
      .onSnapshot(doc => {
        // make sure friend was not removed before updating
        let stillFriends = doc.data().friends.find(uid=>uid===getState().currentUser.uid);
        if(stillFriends) {
          dispatch(updateFriends(doc.data()));
        } else {
          dispatch(removeFriendSuccess(doc.data().uid));
        }
      }, (error) => {
        console.log(error);
      })
  })
}

export const updateUserStatus = (status) => (dispatch, getState) => {
  firebase.firestore().doc(`users/${getState().currentUser.uid}`)
    .update({
      status
    })
    .then(() => {
      return dispatch(updateStatus(status));
    })
    .catch( () => {
      dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
    })
}

export const setPreferredMapType = (preferredMapType) => (dispatch, getState) => {
  firebase.firestore().doc(`users/${getState().currentUser.uid}`)
    .update({
      preferredMapType
    })
    .then(() => {
      return dispatch(updatePreferredMapType(preferredMapType))
    })
    .catch( () => {
      dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
    })
}

export const getFriendRequestsReceived = () => (dispatch, getState) => {
  firebase.firestore().collection('friendRequests')
    .where('requesteeId', '==', getState().currentUser.uid)
    .onSnapshot(querySnapshot => {
      let friendRequestsReceived = [];
      let counter = 0;
      let snapshotSize = querySnapshot.size;
      querySnapshot.forEach(requestDoc => {
        firebase.firestore().doc(`users/${requestDoc.data().requestorId}`)
          .get()
          .then(doc => {
            const { photoURL, displayName, uid } = doc.data();
            let data = {
              photoURL,
              displayName,
              uid
            }
            if(requestDoc.data().status === 'pending') {
              friendRequestsReceived.push(data);
            }
            counter++;
            return counter;
          })
          .then((counter) => {
            if(snapshotSize === counter) {
              dispatch(updateFriendRequestsReceived(friendRequestsReceived))
            }
          })
          .catch( () => {
            dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
          })
      })
    }, error => {
      console.log(error);
    })
}

export const getFriendRequestsSent = () => (dispatch, getState) => {
  firebase.firestore().collection('friendRequests')
    .where('requestorId', '==', getState().currentUser.uid)
    .onSnapshot(querySnapshot => {
      let friendRequestsSent = [];
      let counter = 0;
      let snapshotSize = querySnapshot.size;
      querySnapshot.forEach(doc => {
        if(doc.data().status === 'pending') {
          firebase.firestore().doc(`users/${doc.data().requesteeId}`)
            .get()
            .then(doc => {
              const { photoURL, displayName, uid } = doc.data();
              let data = {
                photoURL,
                displayName,
                uid
              }
              friendRequestsSent.push(data);
              counter++;
              return counter;
            })
            .then((counter) => {
              if(snapshotSize === counter) {
                dispatch(updateFriendRequestsSent(friendRequestsSent))
              }
            })
            .catch( () => {
              dispatch(displayError({message: 'Sorry, there was a problem. Please try again later.'}))
            })
        }
      })
    }, error => {
      console.log(error);
    })
}