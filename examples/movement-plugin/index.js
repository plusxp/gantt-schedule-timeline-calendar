import GSTC from '../../dist/gstc.esm.min.js';
import { Plugin as TimelinePointer } from '../../dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from '../../dist/plugins/selection.esm.min.js';
import { Plugin as ItemMovement } from '../../dist/plugins/item-movement.esm.min.js';
import { Plugin as ItemResizing } from '../../dist/plugins/item-resizing.esm.min.js';

let canChangeRow = true;
let canCollide = true;
document.getElementById('can-change-row').addEventListener('change', function (el) {
  canChangeRow = el.target.checked;
});
document.getElementById('can-collide').addEventListener('change', function (el) {
  canCollide = el.target.checked;
});

function isCollision(item) {
  const allItems = gstc.api.getAllItems();
  for (const itemId in allItems) {
    if (itemId === item.id) continue;
    const currentItem = allItems[itemId];
    if (currentItem.rowId === item.rowId) {
      if (item.time.start >= currentItem.time.start && item.time.start <= currentItem.time.end) return true;
      if (item.time.end >= currentItem.time.start && item.time.end <= currentItem.time.end) return true;
      if (item.time.start <= currentItem.time.start && item.time.end >= currentItem.time.end) return true;
      if (item.time.start >= currentItem.time.start && item.time.end <= currentItem.time.end) return true;
    }
  }
  return false;
}

const movementPluginConfig = {
  events: {
    onMove({ items }) {
      // prevent items to change row
      return items.before.map((beforeMovementItem, index) => {
        const afterMovementItem = items.after[index];
        const myItem = GSTC.api.merge({}, afterMovementItem);
        if (!canChangeRow) {
          myItem.rowId = beforeMovementItem.rowId;
        }
        if (!canCollide && isCollision(myItem)) {
          myItem.time = { ...beforeMovementItem.time };
          myItem.rowId = beforeMovementItem.rowId;
        }
        return myItem;
      });
    },
  },
  snapToTime: {
    start({ startTime, time }) {
      return startTime.startOf('day').add(12, 'hour');
    },
    end({ endTime, time }) {
      return endTime.startOf('day').add(12, 'hour');
    },
  },
};

const rowsFromDB = [
  {
    id: '1',
    label: 'Row 1',
  },
  {
    id: '2',
    label: 'Row 2',
  },
];

const itemsFromDB = [
  {
    id: '1',
    label: 'Item 1',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-01-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '2',
    label: 'Item 2',
    rowId: '1',
    time: {
      start: GSTC.api.date('2020-02-01').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-02-02').endOf('day').add(12, 'hour').valueOf(),
    },
  },
  {
    id: '3',
    label: 'Item 3',
    rowId: '2',
    time: {
      start: GSTC.api.date('2020-01-15').startOf('day').add(12, 'hour').valueOf(),
      end: GSTC.api.date('2020-01-20').endOf('day').add(12, 'hour').valueOf(),
    },
  },
];

const columnsFromDB = [
  {
    id: 'id',
    label: 'ID',
    data: ({ row }) => GSTC.api.sourceID(row.id), // show original id (not internal GSTCID)
    sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)), // sort by id converted to number
    width: 80,
    header: {
      content: 'ID',
    },
  },
  {
    id: 'label',
    data: 'label',
    sortable: 'label',
    isHTML: false,
    width: 230,
    header: {
      content: 'Label',
    },
  },
];

// Configuration object
const config = {
  // for free key for your domain please visit https://gstc.neuronet.io/free-key
  // if you need commercial license please visit https://gantt-schedule-timeline-calendar.neuronet.io/pricing

  licenseKey:
    '====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====',

  plugins: [
    TimelinePointer({}), // timeline pointer must go first before selection, resizing and movement
    Selection(),
    ItemResizing(), // resizing must go before movement
    ItemMovement(movementPluginConfig),
  ],
  list: {
    columns: {
      data: GSTC.api.fromArray(columnsFromDB),
    },
    rows: GSTC.api.fromArray(rowsFromDB),
  },
  chart: {
    items: GSTC.api.fromArray(itemsFromDB),
  },
};

// Generate GSTC state from configuration object
const state = GSTC.api.stateFromConfig(config);

// for testing
// @ts-ignore
window.state = state;

// Mount the component
const app = GSTC({
  element: document.getElementById('gstc'),
  state,
});

//for testing
// @ts-ignore
window.gstc = app;
