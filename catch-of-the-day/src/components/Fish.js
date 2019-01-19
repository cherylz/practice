import React from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';

// since we'll use prop-types as a static property, we need to change Fish from a function component to a class component.
class Fish extends React.Component {
  static propTypes = {
    fish: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      desc: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number
    }),
    addToOrder: PropTypes.func,
    index: PropTypes.string
  };
  // why static? we can use static if we want something only in the class and won't be instantiated by an object. in this specific case, because it's gonna be the same for every Fish component, living on the mama fish, instead of living in every single instance (every new fish we make). in other words, we are declaring prop-types for all of the fish, every single time we make a new fish, it's not necessary to duplicate the prop-types for every single one.
  // search for "this.props" to quickly get what props we've got here.

  addToOrder = () => { this.props.addToOrder(this.props.index); };
  /* equivalent to
   function addToOrder() { this.props.addToOrder(this.props.index); }
   */

  render() {
    const { name, image, desc, price, status } = this.props.fish;
    const isAvailable = status === 'available';
    // think why we use boolean instead of anything else. -> because we can reuse it to toggle button disable
    /*
     if (this.props.fish === null) {
       return null;
     }
     */
    return (
        <li className="menu-fish">
          <img src={image} alt={name} />
          <h3 className="fish-name">
            {name}
            <span className="price">{formatPrice(price)}</span>
          </h3>
          <p>{desc}</p>
          <button
            disabled={!isAvailable}
            onClick={this.addToOrder}
          >
            {isAvailable ? "Add To Order" : "Sold Out!"}
          </button>
        </li>
    )
  }
}

export default Fish;
