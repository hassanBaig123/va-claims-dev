import { DateTime } from 'luxon';

const token = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzEzMjEyNTM1LCJqdGkiOiI1ZTk4MDI2Yi1jOTgyLTQ1ZDMtYjcwOS05YzIzMzY3ZTUwNDgiLCJ1c2VyX3V1aWQiOiI4NmNlNGY4Zi0yZjJhLTQxMTctYmMyYS02M2Q1YmM5MWM3N2UifQ.W_3wxW5uolYyQLko9X5-6_EV3gV_5EyGycrCSV0q3gYuNuewHb76j6h4CRyQGXNJV5BeXl2h7T73z29D9Q1-RQ';

// Path: utils/data/calendly/schedule.ts
export const fetchCalendlyEvents = async (pageToken = '', email?: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  const now = DateTime.now().toISO({ includeOffset: false }) + '000Z';

  console.log(now); //2022-02-22T20:00:00Z
  let url = `https://api.calendly.com/scheduled_events?count=20&status=active&min_start_time=${now}&user=https://api.calendly.com/users/86ce4f8f-2f2a-4117-bc2a-63d5bc91c77e&sort=start_time:asc`;
  if (pageToken) {
    url += `&page_token=${pageToken}`;
  }
  if (email) {
    url += `&email=${email}`;
  }

  console.log(url);

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getCalendlyEvents = async () => {
  let pageToken = '';
  let events: any[] = [];
  let data = await fetchCalendlyEvents(pageToken);

  while (data.collection.length) {
    events = events.concat(data.collection);
    pageToken = data.pagination.next_page_token;
    data = await fetchCalendlyEvents(pageToken);
  }

  return events;
};

