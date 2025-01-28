import { Request, Response } from "express";

export class TicketController {
  constructor() {}

  public getTickets = async (req: Request, res: Response) => {
    res.json('getTickets');
  }

  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json('getTickets');
  }

  public pendingTickets = async (req: Request, res: Response) => {
    res.json('pendingTickets');
  }

  public createTickets = async (req: Request, res: Response) => {
    res.json('createTickets');
  }

  public drawTickets = async (req: Request, res: Response) => {
    res.json('drawTickets');
  }

  public ticketFinished = async (req: Request, res: Response) => {
    res.json('ticketFinished');
  }

  public workingOn = async (req: Request, res: Response) => {
    res.json('workingOn');
  }

}
