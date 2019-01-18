import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';

class Order extends React.Component {
  static propTypes = {
    removeFromOrder: PropTypes.func,
    order: PropTypes.object,
    fishes: PropTypes.object
  };

  removeFromOrder = (e) => {
    this.props.removeFromOrder(e.target.name);
  }

  renderOrder = (key) => {
    const count = this.props.order[key];
    const fish = this.props.fishes[key];
    const isAvailable = fish && fish.status === 'available'; // fallback: if fish is deleted, property 'status' of null cannot be read

    // make sure the fish is loaded before we continue
    if (!count || !fish) return null;

    if (!isAvailable) {
      return (
        <li key={key}>
          Sorry, {fish ? fish.name : 'fish'}fish is no longer available {/* fallback: if fish is deleted, no fish name is available  */}
        </li>
      )
    }

    return (
      <li key={key}>
        {count}lbs {fish['name']}
        <span>{formatPrice(fish['price'] * count)}</span>
        <button
          name={key}
          onClick={this.removeFromOrder}
        >
          &times;
        </button>
      </li>
    )
  }

  render() {
    const objectIds = Object.keys(this.props.order);
    const total = objectIds.reduce((prevTotal, key) => {
      const count = this.props.order[key];
      const fish = this.props.fishes[key];
      const isAvailable = fish && fish.status === 'available';
    // why do we need to make sure the fish is loaded before we continue?
      // => local storage is local, it will be set immediately, while with rebase, you have to go to firebase and come back. so we are rendering the order before the fishes come back. try:
        // console.log(this.props.fishes); // when you reload the page, you'll see the first rendering is { }, then after mounting, the second rendering is the fishes stored in firebase.
        // console.log(key); // in the two renderings when you reload the page, you'll see the key twice, instead of the first time undefined and the second time the key is there.
      if (!isAvailable || !count) {
        return prevTotal;
      }
      return prevTotal + fish['price'] * count; // what if count is null? price * null = 0. so this case is covered. no worries. but to be safe, i still manually set the condition in the if statement above.
    }, 0);

    return (
      <div className="order-wrap">
        <h2>Your Order</h2>
        <ul className="order">
          {objectIds.map((key) => this.renderOrder(key))}
          {/* why does this one also work: {objectIds.map(this.renderOrder)}*/}
        </ul>
        <div className="total">
          Total:
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    );
  }
}

export default Order;
