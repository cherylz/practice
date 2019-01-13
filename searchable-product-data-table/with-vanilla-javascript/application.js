const inventories = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

// get the data - return an array of matched results
function findMatches() {
  // note that if keyword is empty and onlyStocked is false, all the inventories will be matched
  const keyword = document.querySelector('input[type="text"]').value;
  const onlyStocked = document.querySelector('input[type="checkbox"]').checked;

  return inventories.filter((inventory) => {
    const regex = new RegExp(keyword);
    if (onlyStocked) {
      return inventory.name.match(regex) && inventory.stocked;
    }
    return inventory.name.match(regex);
  });
};

function render() {
  /** Below is moved to the function findMatches to control data in the same place. (good practice learned from React)
  const text = document.querySelector('input[type="text"]');
  const checkbox = document.querySelector('input[type="checkbox"]');
  const keyword = text.value;
  const onlyStocked = checkbox.checked;
  const matched = findMatches(keyword, onlyStocked, inventories);
  */
  const matched = findMatches(); // get the data from a single source
  let lastCategory = null;
  const html = matched.map((inventory) => {
    if (inventory.category !== lastCategory) {
      lastCategory = inventory.category;
      return `
        <div class="category">${inventory.category}</div>
        <div class="two-col">
          ${inventory.stocked ? `<div>${inventory.name}</div>` : `<div class="no-stock">${inventory.name}</div>`}
          <div>${inventory.price}</div>
        </div>
      `
    }
    return `
      <div class="two-col">
        ${inventory.stocked ? `<div>${inventory.name}</div>` : `<div class="no-stock">${inventory.name}</div>`}
        <div>${inventory.price}</div>
      </div>
    `
  }).join('');

  const results = document.querySelector('.results');
  results.innerHTML = html;
};


document.addEventListener('DOMContentLoaded', function() {
  render();

  const text = document.querySelector('input[type="text"]');
  const checkbox = document.querySelector('input[type="checkbox"]');

  // text.addEventListener('change', render); // think: do we really need the change event?
  text.addEventListener('keyup', render);
  checkbox.addEventListener('click', render);
});
