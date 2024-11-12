export const groupAndSortTickets = (tickets, groupBy, sortBy) => {
    let grouped = {};
    if (groupBy === 'status') {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    }
    // Add sorting logic if needed
    return grouped;
  };