// import React from 'react';
// import Layout from '../components/Layout';
// //added to it
// import EventSearch from "../components/EventSearch";

// const Events = () => {
//     return (
//         <div>
//             <Layout>
//             <h1>Events Page</h1>
//             <p>Browse and manage events here.</p>
//             <EventSearch />
//             </Layout>
//         </div>
//     );
// };

// export default Events;

import React from "react";
import EventSearch from "../components/EventSearch";

const Events = ({ searchQuery, locationQuery }) => {
  return (
    <div>
      <h1>Events Page</h1>
      <p>Browse and manage events here.</p>
      
      <EventSearch searchQuery={searchQuery} locationQuery={locationQuery} />
      
    </div>
  );
};

export default Events;