/* eslint-disable no-alert */

// window.localStorage;

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  for (let i = 0; i < producers.length; i++) {
    if (coffeeCount >= producers[i].price / 2) {
      producers[i].unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  let trueData = [];
  data.producers.filter((producer) => {
    if (producer.unlocked === true) {
      trueData.push(producer);
    }
    console.log(trueData);
  });
  return trueData;
}

function makeDisplayNameFromId(id) {
  let returnStr = "";
  for (let i = 0; i < id.length; i++) {
    let char = id[i];
    if (char === "_") {
      returnStr += char.replace("_", " ");
    } else {
      returnStr += char;
    }
  }
  return returnStr
    .toLowerCase()
    .split(" ")
    .map((str) => str[0].toUpperCase() + str.substring(1))
    .join(" ");
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
  let child = Array.from(parent.childNodes);
  for (let i = 0; i < child.length; i++) {
    parent.removeChild(child[i]);
  }
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);
  const container = document.getElementById("producer_container");
  deleteAllChildNodes(container);
  data.producers
    .filter((producer) => producer.unlocked === true)
    .forEach((producer) => {
      container.appendChild(makeProducerDiv(producer));
    });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (producerId === data.producers[i].id) {
      return data.producers[i];
    }
  }
}

function canAffordProducer(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (producerId === data.producers[i].id) {
      if (data.coffee >= data.producers[i].price) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function updateCPSView(cps) {
  let cups = document.getElementById("cps");
  cups.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (producerId === data.producers[i].id) {
      if (data.coffee >= data.producers[i].price) {
        data.producers[i].qty++;
        data.coffee = data.coffee - data.producers[i].price;
        data.producers[i].price = updatePrice(data.producers[i].price);
        data.totalCPS = data.producers[i].cps;
        return true;
      } else {
        return false;
      }
    }
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    if (event.target.id.startsWith("buy")) {
      if (attemptToBuyProducer(data, event.target.id.slice(4))) {
        renderProducers(data);
        updateCoffeeView(data.coffee);
        updateCPSView(data.totalCPS);
      } else {
        window.alert("Not enough coffee!");
      }
    }
  }
}

function tick(data) {
  data.coffee = data.coffee + data.totalCPS;
  const coffeeCounter = document.getElementById("coffee_counter");
  coffeeCounter.innerText = data.coffee;
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
