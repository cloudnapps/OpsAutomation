/**
 * UserBehavior.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs    :: http://sailsjs.org/#!documentation/models
 */
'use strict';

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      required: true,
      unique: true
    },
    //who - EndUser's device id
    deviceId: {
      type: 'string',
      required: true,
      index: true
    },

    deviceType: {
      type: 'string'
    },
    os: {
      type: 'string'
    },
    osVersion: {
      type: 'string'
    },
    sdkVersion: {
      type: 'string'
    },
    deviceUDID: {
      type: 'string'
    },
    deviceUUID: {
      type: 'string'
    },
    deviceModel: {
      type: 'string'
    },
    appState: {
      type: 'integer'
    },
    appBundle: {
      type: 'string'
    },

    appId: {
      type: 'string',
      index: true
    },
    appName: {
      type: 'string'
    },

    //who - user id in our system
    userId: {
      type: 'string',
      index: true
    },

    userCustomerID: {
      type: 'string'
    },
    userName: {
      type: 'string'
    },
    userMobile: {
      type: 'string'
    },
    userEmail: {
      type: 'string'
    },
    userCity: {
      type: 'string'
    },
    userGender: {
      type: 'integer'
    },
    userAge: {
      type: 'integer'
    },
    userTags: {
      type: 'array'
    },

    channel: {
      type: 'integer'
    },

    //what - behavior: campaign, payment, location
    behavior: {
      type: 'string',
      required: true,
      index: true
    },

    //where - which ibeacon (beacon id)
    beaconId: {
      type: 'string'
    },
    //where - which ibeacon (beacon id)
    beaconName: {
      type: 'string'
    },

    //where - beacons around
    beacons: {
      type: 'json'
    },
    //where - location id
    locationId: {
      type: 'string',
      index: true
    },
    locationName: {
      type: 'string'
    },
    locationType: {
      type: 'integer'
    },
    locationParent: {
      type: 'string'
    },
    locationPoiType: {
      type: 'integer'
    },
    locationCustomFields: {
      type: 'json'
    },
    locations: {
      type: 'array'
    },
    locationAncestors: {
      type: 'array'
    },
    hour: {
      type: 'integer'
    },
    startOfHour: {
      type: 'datetime'
    },
    hourOfDay: {
      type: 'integer'
    },
    day: {
      type: 'integer',
      index: true
    },
    startOfDay: {
      type: 'datetime'
    },
    dayOfWeek: {
      type: 'integer'
    },
    dayOfMonth: {
      type: 'integer'
    },
    week: {
      type: 'integer'
    },
    startOfWeek: {
      type: 'datetime'
    },
    month: {
      type: 'integer'
    },
    startOfMonth: {
      type: 'datetime'
    },
    monthOfYear: {
      type: 'integer'
    },
    year: {
      type: 'integer'
    },
    startOfYear: {
      type: 'datetime'
    },

    pushMsgId: {
      type: 'string',
      index: true
    },

    pushMsg: {
      type: 'json'
    },

    //what - related campaign (campaign id)
    campaignId: {
      type: 'string',
      index: true
    },

    campaignName: {
      type: 'string'
    },
    campaignType: {
      type: 'integer'
    },

    campaignTags: {
      type: 'array'
    },

    interactionData: {
      type: 'json'
    },
    campaignValidFrom: {
      type: 'datetime'
    },
    campaignValidTo: {
      type: 'datetime'
    },

    wechatCard: {
      type: 'json'
    },

    projectId: {
      type: 'string',
      index: true
    },
    projectName: {
      type: 'string'
    },

    organizationId: {
      type: 'string',
      required: true,
      index: true
    },
    revision: {
      type: 'string'
    }
  }
};
