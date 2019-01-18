import React from 'react';
import PropTypes from 'prop-types';

class EditFishForm extends React.Component {
  static propTypes = {
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    index: PropTypes.string,
    fish: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      desc: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number
    })
  };

  handleChange = (e) => {
    this.props.updateFish(this.props.index, e.target.name, e.target.value);
  };

  handleClick = () => {
    this.props.deleteFish(this.props.index);
  }

// form doesn't have to have a form tag.
  render() {
    const {name, price, status, desc, image} = this.props.fish;
    return (
      <div className="fish-edit">
        <input
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
        />
        <input
          type="number"
          name="price"
          value={price}
          onChange={this.handleChange}
        />
        <select
          name="status"
          value={status}
          onChange={this.handleChange}
        >
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea
          name="desc"
          value={desc}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="image"
          value={image}
          onChange={this.handleChange}
        />
        <button
          onClick={this.handleClick}
        >
          Remove Fish
        </button>
      </div>
    )
  }
}

export default EditFishForm;
