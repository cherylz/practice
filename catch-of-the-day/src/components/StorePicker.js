import React from 'react';
import PropTypes from 'prop-types';
import { getFunName } from "../helpers";

class StorePicker extends React.Component {
  myInputRef = React.createRef();

  static propTypes = {
    history: PropTypes.object
  };

  goToStore = (e) => {
    e.preventDefault();
    const storeName = this.myInputRef.current.value; // what is current? can we just use const storeName = this.myInputRef.value; -> no.
    // does this work? yes~~~ but, does it touch the DOM? -> dunno yet.
    // const storeName = e.target.children[1].value;
    this.props.history.push(`/store/${storeName}`); // what is history? -> Check <StorePicker /> props in the console, you'll see history and push() inside it. // where are all the store names stored??
  }

  render() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input
          type="text"
          ref={this.myInputRef}
          required
          placeholder="Store Name"
          defaultValue={getFunName()}
        />
        {/* what is defaultValue??? seems like a magic. it's editable while value cannot. GEM from console message: Warning: Failed prop type: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.*/}
        <button type="submit">Visit Store →</button>
      </form>
    );
  }
}

export default StorePicker;
