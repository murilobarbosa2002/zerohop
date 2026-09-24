export interface Contact {
  id: string;
  name: string;
  password: string;
  favorite?: boolean;
}

export type NewContact = Contact;
