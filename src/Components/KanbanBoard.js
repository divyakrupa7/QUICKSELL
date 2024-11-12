// src/Components/KanbanBoard.js
import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';

const KanbanBoard = ({ groupBy, sortBy }) => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupedTickets, setGroupedTickets] = useState({});

  // Function to fetch tickets and users from the API
  const fetchTicketsAndUsers = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('API Data:', data); // Log data to check if it’s retrieved correctly
      setTickets(data.tickets);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to group and sort tickets
  const groupAndSortTickets = (tickets, groupBy, sortBy) => {
    let grouped = {};

    // Group tickets based on the `groupBy` prop
    if (groupBy === 'status') {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    } else if (groupBy === 'user') {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.userId] = acc[ticket.userId] || []).push(ticket);
        return acc;
      }, {});
    } else if (groupBy === 'priority') {
      grouped = tickets.reduce((acc, ticket) => {
        (acc[ticket.priority] = acc[ticket.priority] || []).push(ticket);
        return acc;
      }, {});
    }

    // Sort tickets within each group based on `sortBy` prop
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority; // Descending order
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title); // Ascending order
        }
        return 0;
      });
    });

    return grouped;
  };

  // Fetch tickets and users when component mounts
  useEffect(() => {
    fetchTicketsAndUsers();
  }, []);

  // Update grouped tickets when tickets, groupBy, or sortBy change
  useEffect(() => {
    const grouped = groupAndSortTickets(tickets, groupBy, sortBy);
    setGroupedTickets(grouped);
  }, [tickets, groupBy, sortBy]);

  // Function to find user details by userId
  const getUserDetails = (userId) => users.find(user => user.id === userId);

  return (
    <div className="kanban-board">
      <h2>Kanban Board</h2>
      {/* Render each group as a column */}
      {Object.keys(groupedTickets).map((group, index) => (
        <div key={index} className="kanban-column">
          <h3>{group}</h3>
          {groupedTickets[group].map((ticket) => {
            const user = getUserDetails(ticket.userId);
            return (
              <TicketCard key={ticket.id} ticket={ticket} user={user} />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
