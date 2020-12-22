import axios from "axios";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import { useEffect, useState } from "react";
import Schedular from "./components/Schedular";

function App() {
  const [dataSource, setDataSource] = useState<any>(null);
  const me = true;
  const CALENDER_ID = me
    ? "mohamdnasserhh@gmail.com"
    : "mernasamir66@gmail.com";
  const PUBLIC_KEY = "AIzaSyDRHZSoup6MnaGKKzcVYr77DmSlzbMIR9Q";
  const DataURI = `https://www.googleapis.com/calendar/v3/calendars/${CALENDER_ID}/events?key=${PUBLIC_KEY}`;

  useEffect(() => {
    axios
      .get(DataURI)
      .then(({ data: { items } }) => {
        setDataSource(items);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [DataURI]);
  return <div>{dataSource && <Schedular source={dataSource} />}</div>;
}

export default App;
