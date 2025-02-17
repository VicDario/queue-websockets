const deskHeader = document.querySelector('h1');
const lblPending = document.querySelector('#lbl-pending');
const noMoreAlert = document.querySelector('.alert');
const lblCurrentTicker = document.querySelector('small');

const btnDraw = document.querySelector('#btn-draw');
const btnDone = document.querySelector('#btn-done');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Desk is required');
}

const deskNumber = searchParams.get('escritorio');
let workingTicket = null;

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

async function getTicket() {
  const response = await fetch(`/api/tickets/draw/${deskNumber}`, {
    method: 'PUT',
  });
  const { status, ticket, message } = await response.json();
  if (status === 'error') {
    lblCurrentTicker.innerText = message;
    return;
  }

  workingTicket = ticket;
  lblCurrentTicker.innerText = ticket.number;
}

async function finishTicket() {
  const response = await fetch(`/api/tickets/done/${workingTicket.id}`, {
    method: 'PUT',
  });
  const { status, message } = await response.json();
  if (status === 'error') {
    lblCurrentTicker.innerText = message;
    return;
  }
  workingTicket = null;
  lblCurrentTicker.innerText = 'No ticket';
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

btnDraw.addEventListener('click', getTicket);
btnDone.addEventListener('click', finishTicket);

connectToWebSockets();
loadInitialCount();
