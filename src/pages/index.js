import React, { useEffect, useState } from 'react';
import CommunityLogo from '../assets/Community-Learning.svg';
import EventCard from '../components/event-card';
import Layout from '../components/layout';
import SEO from '../components/seo';
import mockEvents from '../mock-data/mockEvents';

function IndexPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      setUpcomingEvents(mockEvents);
    };
    getEvents();
  }, []);

  useEffect(() => {
    fetch(
      // 'https://sleepy-villani-37e19c.netlify.app/.netlify/functions/pingEvents'
      'http://localhost:8888/.netlify/functions/pingEvents'
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.msg);

        let date_regex = /\w+(day), \w+ \d{1,2} (at) \d{1,2}:\d{1,2} \w+/g; // assumes this is the standard date format and will not change

        // need date, title, picture, and event type (Online or in-person)
        // ask about caching (browser or through functions??)

        let { items } = data.msg;
        items.forEach(item => {
          let date_matches = item.content.match(date_regex);
          let ID_matches = item.content.match(/\d{9}/g); // assuming the id is always a nine digit number

          let event = {
            id: ID_matches ? ID_matches[0] : 'no id found...',
            time: date_matches ? date_matches[0] : 'no date found...',
            name: item.title,
            thumbnail: item.thumbnail,
            is_online_event: item.content.includes('online'), // for now, I don't really see a better way to obtain this info, as there isn't any attribute that specifies this
          };

          console.log(event);
        });
      });
  }, []);

  return (
    <Layout>
      <SEO keywords={[`nashville`, `freecodecamp`]} title="Home" />

      <section className="main-section md:bg-FCCblue-100 ">
        <div className="main-section-content main-section-index-1">
          <div className="pt-8 px-2 md:px-0 md:mr-8 md:w-5/12">
            <h2>
              <span>freeCodeCamp Nashville</span>
              <span className="inline md:hidden">:</span>
            </h2>

            <p className="mb-5">
              The Nashville chapter of FreeCodeCamp, a non-profit organization
              offering free online coding curriculum, is a thriving community of
              developers, designers and students in Middle Tennessee.
            </p>
            <p>
              We welcome coders of all varieties: never wrote a line of code to
              senior-level looking to give back. Follow us on our social media
              platforms or join us at one of our meetings.
            </p>
          </div>

          <div className="flex-auto">
            <CommunityLogo
              className="inline-block"
              alt="Community: learning together"
            />
          </div>
        </div>
      </section>

      <section className="FCC-divider">
        <h2>
          <span className="hidden md:inline">UPCOMING</span> <span>EVENTS</span>
        </h2>
      </section>

      <section className="main-section">
        <div className="main-section-content md:max-w-full md:px-12">
          <div className="px-8 grid gap-12 md:grid-cols-3 md:p-0">
            {upcomingEvents.map(e => {
              return <EventCard key={e.id} event={e} />;
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default IndexPage;
