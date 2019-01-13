import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function ProductCategoryRow(props) {
  const category = props.category; // if bottom-up, it's like asking its parent: i need a property with the key named category and the value being the category
  return (
    <div className="category">
      {category}
    </div>
  );
}

function ProductRow(props) {
  const product = props.product; // since props.product will be called more than once, it's a good idea to assign it to a variable
  const name = product.stocked ? product.name : <span className="no-stock">{product.name}</span>; // since the logic operation is a bit long, it's a good idea to write it outside of the return so return can remain sweet and short
  return (
    <div className="two-col">
      <div>{name}</div>
      <div>{product.price}</div>
    </div>
  )
}
// Learned: an example of Conditional Rendering.
  // Step 1: Use JavaScript operators like if or the conditional operator to create elements representing the current state, and
  // Step 2: let React update the UI to match them in return().

function ProductTable(props) {
  const keyword = props.keyword;
  const inStockOnly = props.inStockOnly;

  const rows = [];
  let lastCategory = null; // Learned: a smart way to handle repetitive categories.

// To revisit -> Think: can we use array.map.join here and why? -> No. It returns a string instead of an array of JSX expressions (a.k.a React elements). Go to the bottom for elaboration.
  props.products.forEach((product) => {
    // Learned: a new way to get the filtered array, different from what we did using RegEx and string.match(). However, with RegEx, we can match more patterns such as being case insensitive.
    // Think: can we let its parent pass a filtered array to ProductTable instead of the raw array so the following two ifs can be avoided? What are the pros and cons? Perhaps we just want to keep the parent with methods that affect all of its children. If filtering the original array only affect one of its children, it would be a good idea to let that child handle it locally. Instead of arranging everything for its child, give the child a chance to face the world independently. :)
    if (product.name.indexOf(keyword) === -1) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }

    // Think: do we need a key here and why? -> Yes, so only the new parts got re-rendered.
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name}
      />
    );
    lastCategory = product.category;
  });

  return (
    <div className="product-table">
      <div className="two-col bold">
        <div>Name</div>
        <div>Price</div>
      </div>
      {rows} {/*after - DRY*/}
      {/* before - Repetitive steps
      <ProductCategoryRow category={props.products[0].category} />
      <ProductRow name={props.products[0].name} price={props.products[0].price} />
      <ProductRow name={props.products[1].name} price={props.products[1].price} />
      <ProductRow name={props.products[2].name} price={props.products[2].price} />
      <ProductCategoryRow category={props.products[3].category} />
      <ProductRow name={props.products[3].name} price={props.products[3].price} />
      <ProductRow name={props.products[4].name} price={props.products[4].price} />
      <ProductRow name={props.products[5].name} price={props.products[5].price} />
      */}
    </div>
  )
}
// Think: is this Composition - Containment? -> Good question but nope in this case.

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeywordChange = this.handleKeywordChange.bind(this); // To understand: `this` in the bind and the other two ways to do it introduced in the React docs.
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleKeywordChange(e) {
    this.props.onKeywordChange(e.target.value);
  }

  handleInStockOnlyChange(e) {
    this.props.onInStockOnlyChange(e.target.checked);
  }

  // we can also rewrite the above two functions by combining them into one function handleInputChange(e) and add name attributes with corresponding value to the two types of input and then use ES6 computed property name syntax. Search "ES6 computed property name" on https://reactjs.org/docs/forms.html for an example.

  render() {
    return (
      <div className="search-bar">
        <input type="text" value={this.props.keyword} onChange={this.handleKeywordChange} placeholder="Search..." />
        <div>
          <input type="checkbox" onChange={this.handleInStockOnlyChange} checked={this.props.inStockOnly} />
          Only show products in stock
        </div>
      </div>
    )
  }
}

// Think: when do we need a constructor since it is optional in a class component?
  // Most Common Use Case For Constructor: Setting up state, creating refs and method binding. - https://blog.bitsrc.io/react-16-lifecycle-methods-how-and-when-to-use-them-f4ad31fb2282
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    // to reflect the initial state of the application
    this.state = {
      keyword: '',
      inStockOnly: false,
    };

    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleInStockOnlyChange = this.handleInStockOnlyChange.bind(this);
  }

  handleKeywordChange(keyword) {
    this.setState({
      keyword: keyword
    });
  }

  handleInStockOnlyChange(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    });
  }

  render() {
    return (
      <form>
        <SearchBar
          keyword={this.state.keyword}
          inStockOnly={this.state.inStockOnly}
          onKeywordChange = {this.handleKeywordChange}
          onInStockOnlyChange = {this.handleInStockOnlyChange}
        />
        <ProductTable
          products={this.props.products}
          keyword={this.state.keyword}
          inStockOnly={this.state.inStockOnly}
        />
      </form>
    )
  }
}

const inventories = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

// ========================================

ReactDOM.render(
  <FilterableProductTable products={inventories} />,
  document.getElementById('root')
);

/*
A quick way to test out is to try it on https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlImn2kA8ACmXACYjQBKcA7nQYMADm07QAvAVEcuUAL6ChpANaoAnlJnioAOjABDALapFy0gHoAfEtIBuIoqA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=6.26.0&envVersion=

Alternatively, try below and see how the screen is filled with a string like this: <ProductCategoryRow category=Sporting Goods key=Sporting Goods /> <ProductRow product=[object Object] key=Football /> <ProductRow product=[object Object] key=Baseball /> <ProductRow product=[object Object] key=Basketball /> <ProductCategoryRow category=Electronics key=Electronics /> <ProductRow product=[object Object] key=iPod Touch /> <ProductRow product=[object Object] key=iPhone 5 /> <ProductRow product=[object Object] key=Nexus 7 />
  const rows = props.products.map((product) => {
    if (product.category !== lastCategory) {
      lastCategory = product.category;
      return `
        <ProductCategoryRow
          category=${product.category}
          key=${product.category}
          />
        <ProductRow
          product=${product}
          key=${product.name}
        />
      `;
    } else {
      return `
        <ProductRow
          product=${product}
          key=${product.name}
        />
      `;
    }
  }).join('');
*/
