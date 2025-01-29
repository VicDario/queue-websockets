const currentTicketLabel = document.querySelector('span');
const createTicketButton = document.querySelector('button');

async function getLastTicket() {
  const response = await fetch('/api/tickets/last');
  const lastTicket = await response.json();
  currentTicketLabel.innerText = lastTicket;
}


async function createTicket() {
  const response = await fetch('/api/tickets', {
    method: 'POST'
  });
  const newTicket = await response.json();
  currentTicketLabel.innerText = newTicket.number;
}

createTicketButton.addEventListener('click', createTicket);

getLastTicket();
