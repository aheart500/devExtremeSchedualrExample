import React, { useState, useRef } from "react";

import Scheduler, { AppointmentDragging } from "devextreme-react/scheduler";
import Draggable from "devextreme-react/draggable";
import ScrollView from "devextreme-react/scroll-view";

import { rooms as roomsData, tasks } from "./data";

const currentDate = new Date(2020, 11);
const draggingGroupName = "appointmentsGroup";
const Appointment = ({ appointmentData }: { appointmentData: any }) => {
  return (
    <>
      <span>{appointmentData.summary}</span>
    </>
  );
};
const ToolTip = (props) => {
  console.log(props);
  return <h1>{props.appointmentData.text}</h1>;
};
const Schedular = ({ source }: { source?: any }) => {
  const schedulerRef = useRef(null);
  const [rooms, setRooms] = useState(roomsData);
  const [state, setState] = useState({
    tasks,
    appointments: source.map((item) => {
      return {
        ...item,
        startDate: item.start.dateTime,
        endDate: item.end.dateTime,
      };
    }),
  });

  const getToday = () => {
    if (schedulerRef && schedulerRef.current) {
      (schedulerRef as any).current.instance.option("currentDate", new Date());
    }
  };
  const hideRoom = (id: number) => {
    setRooms([...rooms.filter((room) => room.id !== id)]);
  };
  const onAppointmentRemove = (e) => {
    const index = state.appointments.indexOf(e.itemData);

    if (index >= 0) {
      state.appointments.splice(index, 1);
      state.tasks.push(e.itemData);

      setState({
        tasks: [...state.tasks],
        appointments: [...state.appointments],
      });
    }
  };
  const onAppointmentAdd = (e) => {
    const movedTask = state.tasks.find((task) => task === e.fromData);
    if (movedTask) {
      setState({
        tasks: [...state.tasks.filter((item) => item !== movedTask)],
        appointments: [...state.appointments, e.itemData],
      });
    }
  };

  const onListDragStart = (e) => {
    e.cancel = true;
  };

  const onItemDragStart = (e) => {
    e.itemData = e.fromData;
  };

  const onItemDragEnd = (e) => {
    if (e.toData) {
      e.cancel = true;
    }
  };
  console.log(state);
  return (
    <>
      <ScrollView id="scroll">
        <Draggable
          id="list"
          data="dropArea"
          group={draggingGroupName}
          onDragStart={onListDragStart}
        >
          {state.tasks.map((task, i) => {
            return (
              <Draggable
                key={i}
                className="item dx-card dx-theme-text-color dx-theme-background-color"
                clone={true}
                group={draggingGroupName}
                data={task}
                onDragStart={onItemDragStart}
                onDragEnd={onItemDragEnd}
              >
                {task.text}
              </Draggable>
            );
          })}
        </Draggable>
      </ScrollView>

      <Scheduler
        timeZone="Africa/Cairo"
        id="scheduler"
        ref={schedulerRef}
        onCellClick={(e) => {
          e.component.instance().option("currentView", "day");
          e.component.instance().option("currentDate", e.cellData.startDate);
        }}
        appointmentRender={(props) => <Appointment {...props} />}
        onAppointmentFormOpening={(e) => (e.cancel = true)}
        appointmentTooltipRender={(props) => <ToolTip {...props} />}
        dataSource={state.appointments}
        views={["day", "workWeek", "month"]}
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9}
        editing={true}
        onAppointmentDeleted={(e) => console.log("ff")}
      >
        <AppointmentDragging
          group={draggingGroupName}
          onRemove={onAppointmentRemove}
          onAdd={onAppointmentAdd}
        />
      </Scheduler>
      <button onClick={getToday} style={{ position: "relative" }}>
        Today
      </button>
      <button onClick={() => hideRoom(1)} style={{ position: "relative" }}>
        hide room 1
      </button>
      <button onClick={() => hideRoom(2)} style={{ position: "relative" }}>
        hide room 2
      </button>
      <button onClick={() => hideRoom(3)} style={{ position: "relative" }}>
        hide room 3
      </button>
    </>
  );
};

export default Schedular;
