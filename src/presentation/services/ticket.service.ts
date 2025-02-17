import { UuidAdapter } from '../../config/uuid.adapter';
import { Ticket } from '../../domain/interfaces/ticket.interface';
import { WssService } from './wss.service';

export class TicketService {
  constructor(private readonly wssService: WssService = WssService.instance) {}

  public tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
  ];

  private readonly _workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this._workingOnTickets.slice(0, 4);
  }

  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
    };
    this.tickets.push(ticket);

    this.onTicketNumberChanged();
    return ticket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDesk);
    if (!ticket) return { status: 'error', message: 'No tickets available' };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this._workingOnTickets.unshift({ ...ticket });
    this.onTicketNumberChanged();
    this.onWorkingOnChanged();

    return { status: 'success', ticket };
  }

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) return { status: 'error', message: 'Ticket not found' };

    ticket.done = true;
    ticket.doneAt = new Date();

    return { status: 'success' };
  }

  private onTicketNumberChanged() {
    this.wssService.sendMessage('on-ticket-number-changed', this.pendingTickets.length);
  }

  private onWorkingOnChanged() {
    this.wssService.sendMessage('on-working-on-changed', [...this.lastWorkingOnTickets]);
  }
}
