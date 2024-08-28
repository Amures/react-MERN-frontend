import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUploadEvent, onLoadEvents } from "../store";
import { convertEventsToDateEvents } from "../helpers";
import { calendarApi } from "../api";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const setActiveEvent = (calendarEvent) => {
      dispatch(onSetActiveEvent(calendarEvent))
  }
  
  const startSavingEvent = async(calendarEvent) => {

    try {
      if( calendarEvent.id) {
        //Actualizando evento
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUploadEvent({...calendarEvent, user}));
        return;
  
      }
      //Creando evento
      const { data } = await calendarApi.post('/events', calendarEvent);
      dispatch(onAddNewEvent({...calendarEvent, id: data.event.id, user }));
    } catch (error) {
      console.log(error);
      Swal.fire('Error al guardar', error.response.data?.msg, 'error');
    }
  }

  const startDeleteEvent = async() => {
    try{
      await calendarApi.delete(`/events/${activeEvent.id}`);
      dispatch(onDeleteEvent());

    } catch(error){
      console.log(error);
      Swal.fire('Error al guardar', error.response.data?.msg, 'error');
    }
  }

  const startLoadingEvents = async() => {
    try{
      const { data } = await calendarApi.get('/events');
      const events = convertEventsToDateEvents(data.events);
      dispatch(onLoadEvents(events));
    } catch(error) {
      console.log({error})
    }
  }
  

  return {
        //* Properties
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,

        //*Methods
        setActiveEvent,
        startDeleteEvent,
        startLoadingEvents,
        startSavingEvent,
  }
}
