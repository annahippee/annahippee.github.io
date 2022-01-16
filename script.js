/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((products) => {
    if (coffeeCount >= products.price / 2 && products.unlocked !== true) {
      products.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  let producersArr = data.producers;
  return producersArr.filter((product) => {
    if (product.unlocked === true) {
      return product;
    }
  });
}

function makeDisplayNameFromId(id) {
  let displayName = "";
  for (let i = 0; i < id.length; i++) {
    if (id[i] === "_") {
      displayName += " ";
      continue;
    }
    if (i === 0 || id[i - 1] === "_") {
      displayName += id[i].toUpperCase();
    } else {
      displayName += id[i];
    }
  }
  return displayName;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  //unlock producers based on the data, store them in unlockedProducers array
  unlockProducers(data.producers, data.coffee);
  let unlockedProducers = getUnlockedProducers(data);

  let producerContainer = document.getElementById("producer_container");

  //remove existing children on producerContainer
  while (producerContainer.firstChild) {
    producerContainer.removeChild(producerContainer.firstChild);
  }

  // for each unlocked producer, create a new div & append to producer_container;
  unlockedProducers.forEach((producer) => {
    let containerDiv = makeProducerDiv(producer);
    producerContainer.appendChild(containerDiv);
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producerArray = data.producers;

  //loop through the array and return matching id object(could probably refactor this later)
  for (let producerObj of producerArray) {
    if (producerObj.id === producerId) {
      return producerObj;
    }
  }
}

function canAffordProducer(data, producerId) {
  let tempProducer = getProducerById(data, producerId);
  if (data.coffee >= tempProducer.price) {
    return true;
  } else {
    return false;
  }
}

function updateCPSView(cps) {
  let cpsDisplay = document.querySelector("#cps");
  cpsDisplay.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  // store the producerObj for easy access
  let attempedBuyProducer = getProducerById(data, producerId);

  // if user can afford the producer...
  if (canAffordProducer(data, producerId)) {
    //increment the qty of the producer
    attempedBuyProducer.qty++;

    //subtract cost from total coffee
    data.coffee -= attempedBuyProducer.price;

    //update future purchase price
    attempedBuyProducer.price = updatePrice(attempedBuyProducer.price);

    //update CPS
    data.totalCPS += attempedBuyProducer.cps;
    updateCPSView(data.totalCPS);

    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    //extract the producerId from the event id (is there a better way to do this?)
    let producerId = event.target.id.slice(4);

    //check to see if player can afford the clicked producer, if so, proceed with purchase
    if (canAffordProducer(data, producerId)) {
      attemptToBuyProducer(data, producerId);
      renderProducers(data);
      updateCoffeeView(data.coffee);
    }

    //else send an alert saying, "not enough coffee!"
    else {
      window.alert("Not enough coffee!");
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}


/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
