import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  };

  componentDidMount() {
    const { params } = this.props.match; // we deconstruct here otherwise it will be too long below.
    // first reinstate our local storage
    const localStorageRef = localStorage.getItem(params.storeId);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }

    this.ref = base.syncState(`${params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }
  // ref is not ref in React. it is https://firebase.google.com/docs/reference/js/firebase.database.Reference
  // in this case, no need to sync the entire database on firebase. we are only syncing the right store with the right store name and also the fishes data not the order.
    // -> where do we get the name of the store in App.js? go to console and check the props of <App />. inside it, you'll see match -> params -> storeId.
    // -> why /fishes? good thing about firebase: as you go deeper, you just go with /xxx/xxx/xxx to get the specific data you need.
  // apart from the first parameter, syncState also requires an object of some options
  // above is to listen for changes. to avoid memory leak, we need to unlisten for changes to clean up when we leave the store. check componentWillUnmount() for it.

  // local storage has a key-value representation.
  componentDidUpdate() {
    // console.log(this.state.order);
    localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
  }
  // try this.state.order without JSON.stringify() and see [object Object] as the value stored in the local storage. why? -> if you ever try to convert an object to a string or to put object in a place where a string is required, like alert(obj), the browser will just call .toString() method on that object and gives you [object Object]. we can fix it by converting that object to a string representation with JSON.stringify() ;)

  componentWillUnmount() {
    // console.log('unmounting');
    base.removeBinding(this.ref);
  }
  // this is why we stored the reference in the database (this.ref = ... in componentDidMount()), so when we leave, we can remove it.

  addFish = (newFish) => {
    const fishes = { ...this.state.fishes };
    fishes[`fish${Date.now()}`] = newFish;
    this.setState({ fishes });
  }

  updateFish = (key, name, change) => {
    const fishes = { ...this.state.fishes };
    fishes[key][name] = change;
    this.setState({ fishes });
  }

  deleteFish = (key) => {
    const fishes = { ...this.state.fishes };
    fishes[key] = null;
    this.setState({ fishes });
  }

  loadSampleFishes = () => {
    const sampleFishesFormatted = { ...sampleFishes };
    for (let key in sampleFishesFormatted) {
      sampleFishesFormatted[key]['price'] = parseFloat(sampleFishesFormatted[key]['price']);
    }
    const fishes = { ...this.state.fishes, ...sampleFishesFormatted };
    this.setState({ fishes });
  }

  addToOrder = (key) => {
    // 3 steps
    const order = { ...this.state.order };
    order[key] = order[key] + 1 || 1;
    this.setState({ order: order });
  };

  removeFromOrder = (key) => {
    const order = { ...this.state.order };
    order[key] = null; // or: delete order[key]; // alternatively, we can delete that item entirely. but i prefer to keep it null in the order.
    this.setState({ order });
  }

  render() {
    const fishes = this.state.fishes;
    const order = this.state.order;
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header />
          <ul className="fishes">
            {Object.keys(fishes).map((key) => (
              <Fish
                key={key}
                index={key}
                fish={fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={fishes}
          order={order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          fishes={fishes}
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
        />
      </div>
    )
  }
}

export default App;
