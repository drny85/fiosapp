import { useEffect, useContext } from 'react';
import authContext from '../context/auth/authContext';
import notesContext from '../context/notes/notesContext';
import moment from 'moment';

export const useTodayNotes = (startDate = new Date(), endDate = new Date()) => {
	const { notes, getNotes, deleteOlderNotes } = useContext(notesContext);
	const { user } = useContext(authContext);

	useEffect(() => {
		//deleteOlderNotes(user?.id);
		getNotes(user?.id);
	}, [user, notes.length]);

	return notes.filter(
		(n) =>
			moment(n.addedOn).isAfter(moment(startDate).startOf('day')) &&
			moment(n.addedOn).isBefore(moment(endDate).endOf('day'))
	);
};
