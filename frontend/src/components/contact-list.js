import React from 'react';
import ContactCard from './contact-card';

export default function ContactList({list, search, alphabet, deletarContato}) {

  return (
    <ul>
      {
        list
          .filter(contact => 
            search ? contact.name
              .toLowerCase()
              .includes(search.toLowerCase()) : true
          )
          .filter(contact =>
            alphabet ? contact.name
              .toLowerCase()
              .startsWith(alphabet): true)
          .map(contact => (
            <ContactCard key={contact.id} contact={contact} deleteContact={deletarContato} />
        ))
      }
    </ul>
  );
}