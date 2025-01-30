const deskHeader = document.querySelector('h1');
const lblPending = document.querySelector('#lbl-pending');
const noMoreAlert = document.querySelector('.alert');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Desk is required');
}
const deskNumber = searchParams.get('escritorio');

deskHeader.innerText = deskNumber;

function checkTicketCount(initialCount = 0) {
  if (initialCount === 0) noMoreAlert.classList.remove('d-none');
  else noMoreAlert.classList.add('d-none');
  lblPending.innerHTML = initialCount;
}

async function loadInitialCount() {
  const response = await fetch('/api/tickets/pending');
  const pendingTickets = await response.json();
  checkTicketCount(pendingTickets.length);
}

function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data);
    if (type !== 'on-ticket-number-changed') return;
    checkTicketCount(payload);
  };

  socket.onclose = (event) => {
    console.log('Connection closed');
    setTimeout(() => {
      console.log('retrying to connect');
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log('Connected');
  };
}

connectToWebSockets();
loadInitialCount();
