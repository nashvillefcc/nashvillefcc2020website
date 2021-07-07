const fetch = require('node-fetch');
var faunadb = require('faunadb'),
  q = faunadb.query;
var client = new faunadb.Client({
  secret: 'fnAEMbG7V8ACBCYzAGMmFrbunudXm4WMofc2WMMy',
});

var collection_reference = '301610187038392838'; // a reference to the specific collection that contains the cached events data

const handler = async function () {
  try {
    const cache_is_expired = await client
      .query(q.Get(q.Collection('Events'))) // query the events collection to grab the timestamp of the last time it was changed
      .then(function (response) {
        const five_days = 28800000; // five days is the expiration time, an arbitrary number that can change... lower this number (run three times per day )
        const today = Date.now();

        let lastCachedDate = new Date(response.ts / 1000); // take the timestamp and convert it to milliseconds (from microseconds which is faunaDB default)

        let now = new Date(today);
        let difference = now - lastCachedDate; // take the difference between today and the last timestamp

        return difference >= five_days; // return whether or not the timestamp is expired
      });

    const response = cache_is_expired // if the cache_is_expired is true, then request fresh data from the api, store it and then return it
      ? await fetch(
          'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.meetup.com%2FfreeCodeCamp-Nashville%2Fevents%2Frss%2F',
          {
            headers: { Accept: 'application/json' },
          }
        )
          .then(response => response.json())
          .then(data => {
            return client.query(
              q.Replace(q.Ref(q.Collection('Events'), collection_reference), {
                // replace the expired data
                data: { events: data },
              }),
              q.Get(q.Ref(q.Collection('Events'), collection_reference)) // return the fresh data
            );
          })
      : await client.query(
          q.Get(q.Ref(q.Collection('Events'), collection_reference)) // if it is not expired, just query the database
        );

    let stringifiedData = JSON.stringify(response.data.events);
    return {
      statusCode: 200,
      body: stringifiedData,
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
