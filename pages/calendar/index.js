import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../components/Layout'
import { useRouter } from 'next/router';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col } from 'reactstrap';
import moment from 'moment'
import axios, { post } from 'axios'

const Index = ({Cookie}) => {
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()

   const localizer = momentLocalizer(moment)
   const [events, setEvents] = React.useState([{
    id: 1,
    title: 'Events',
    allDay: true,
    start: new Date(2020, 10, 9),
    end: moment(),
    }])

    const [addModal, setAddModal] = React.useState(false);
    const addToggle = () => {
        setAddModalInfo([])
        setAddModal(!addModal);
    }

    const [addModalInfo, setAddModalInfo] = React.useState([]);

    const handleSelect = ({start, end}) => {
        const title = window.prompt("New Event");
        if (title) {
        setAddModalInfo(prev=> [...prev, { start: start, end: end, title: title }])
        // setEvents(prev=> [...prev, { start, end, title }]);
        setAddModal(true)
        }
    }

    const handleConfirm = () => {
        setEvents(prev=> [...prev, addModalInfo[0]])
        addToggle()
    }

   useEffect(()=>{
     !TOKEN && router.push("/login");
     const title=`New message from ${TOKEN.username}`
     const option={
        icon: 'image/JLOGO.png',
        body: 'Hey there! You\'ve been notified!',
        sound: 'sounds/message.mp3'
     }

    // THIS IS NOTIFICATION FOR CHROME - NOT COMPATABLE WITH OTHER FORMAT
    //  console.log(Notification.permission)
    //  if(Notification.permission !='granted') Notification.requestPermission();
    //  else  {
    //     new Notification(title, option);
    //     console.log(window.PasswordCredential)
    //  }
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <>
         <Layout TOKEN={TOKEN} TITLE="CALENDAR">
           <Row>
             <Col>
             <h3 style={{ fontFamily: "Roboto, sans-serif", fontWeight: "700" }}>
                Calendar <span className="text-secondary">Under Development</span>
             </h3>
           <Calendar
             selectable
             style={{padding: '4rem'}}
             onSelectEvent={(event) => {
                  setAddModalInfo(prev=> [...prev, event])
                  setAddModal(true)
                }}
             onSelectSlot={handleSelect}
             localizer={localizer}
             events={events}
           />
             </Col>
           </Row>

        <Modal isOpen={addModal} toggle={addToggle}>
        <ModalHeader toggle={addToggle}>{addModalInfo.length && addModalInfo[0].title}</ModalHeader>
        <ModalBody>
          <p>START: {addModalInfo.length && moment(addModalInfo[0].start).format('LLL')}</p>
          <p>END: {addModalInfo.length && moment(addModalInfo[0].end).format('LLL')}</p>
          <Input type="textarea" placeholder="NOTE"/>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" style={{borderRadius: '0'}} onClick={handleConfirm}>Confirm</Button>{' '}
          <Button color="secondary" style={{borderRadius: '0'}} onClick={addToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
         </Layout>
         <style global jsx>{`
           @font-face {
             font-family: "NEXON Lv2 Gothic";
             src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
               format("woff");
             font-weight: normal;
             font-style: normal;
           }
           .rbc-btn {
             color: inherit;
             font: inherit;
             margin: 0;
           }

           button.rbc-btn {
             overflow: visible;
             text-transform: none;
             -webkit-appearance: button;
             cursor: pointer;
           }

           button[disabled].rbc-btn {
             cursor: not-allowed;
           }

           button.rbc-input::-moz-focus-inner {
             border: 0;
             padding: 0;
           }

           .rbc-calendar {
             font-family: "NEXON Lv2 Gothic";
             box-sizing: border-box;
             height: 100%;
             display: flex;
             flex-direction: column;
             align-items: stretch;
             min-height: 90vh;
           }

           .rbc-calendar *,
           .rbc-calendar *:before,
           .rbc-calendar *:after {
             box-sizing: inherit;
           }

           .rbc-abs-full,
           .rbc-row-bg {
             overflow: hidden;
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
           }

           .rbc-ellipsis,
           .rbc-event-label,
           .rbc-row-segment .rbc-event-content,
           .rbc-show-more {
             font-size: 0.8em;
             display: block;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
           }

           .rbc-rtl {
             direction: rtl;
           }

           .rbc-off-range {
             color: #999999;
           }

           .rbc-off-range-bg {
             background: #e6e6e6;
           }

           .rbc-header {
             overflow: hidden;
             flex: 1 0 0%;
             text-overflow: ellipsis;
             white-space: nowrap;
             padding: 0 3px;
             text-align: center;
             vertical-align: middle;
             font-weight: bold;
             font-size: 90%;
             min-height: 0;
             border-bottom: 1px solid #ddd;
           }
           .rbc-header + .rbc-header {
             border-left: 1px solid #ddd;
           }
           .rbc-rtl .rbc-header + .rbc-header {
             border-left-width: 0;
             border-right: 1px solid #ddd;
           }
           .rbc-header > a,
           .rbc-header > a:active,
           .rbc-header > a:visited {
             color: inherit;
             text-decoration: none;
           }

           .rbc-row-content {
             position: relative;
             user-select: none;
             -webkit-user-select: none;
             z-index: 4;
           }

           .rbc-today {
             background-color: #eaf6ff;
           }

           .rbc-toolbar {
             display: flex;
             flex-wrap: wrap;
             justify-content: center;
             align-items: center;
             margin-bottom: 10px;
             font-size: 16px;
           }
           .rbc-toolbar .rbc-toolbar-label {
             flex-grow: 1;
             font-size: 1.5rem;
             padding: 0 10px;
             text-align: center;
           }
           .rbc-toolbar button {
             color: #373a3c;
             display: inline-block;
             margin: 0;
             text-align: center;
             vertical-align: middle;
             background: none;
             background-image: none;
             border: 1px solid #ccc;
             padding: 0.375rem 1rem;
             border-radius: 4px;
             line-height: normal;
             white-space: nowrap;
           }
           .rbc-toolbar button:active,
           .rbc-toolbar button.rbc-active {
             background-image: none;
             box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
             background-color: #e6e6e6;
             border-color: #adadad;
           }
           .rbc-toolbar button:active:hover,
           .rbc-toolbar button:active:focus,
           .rbc-toolbar button.rbc-active:hover,
           .rbc-toolbar button.rbc-active:focus {
             color: #373a3c;
             background-color: #d4d4d4;
             border-color: #8c8c8c;
           }
           .rbc-toolbar button:focus {
             color: #373a3c;
             background-color: #e6e6e6;
             border-color: #adadad;
           }
           .rbc-toolbar button:hover {
             color: #373a3c;
             background-color: #e6e6e6;
             border-color: #adadad;
           }

           .rbc-btn-group {
             display: inline-block;
             white-space: nowrap;
           }
           .rbc-btn-group > button:first-child:not(:last-child) {
             border-top-right-radius: 0;
             border-bottom-right-radius: 0;
           }
           .rbc-btn-group > button:last-child:not(:first-child) {
             border-top-left-radius: 0;
             border-bottom-left-radius: 0;
           }
           .rbc-rtl .rbc-btn-group > button:first-child:not(:last-child) {
             border-radius: 4px;
             border-top-left-radius: 0;
             border-bottom-left-radius: 0;
           }
           .rbc-rtl .rbc-btn-group > button:last-child:not(:first-child) {
             border-radius: 4px;
             border-top-right-radius: 0;
             border-bottom-right-radius: 0;
           }
           .rbc-btn-group > button:not(:first-child):not(:last-child) {
             border-radius: 0;
           }
           .rbc-btn-group button + button {
             margin-left: -1px;
           }
           .rbc-rtl .rbc-btn-group button + button {
             margin-left: 0;
             margin-right: -1px;
           }
           .rbc-btn-group + .rbc-btn-group,
           .rbc-btn-group + button {
             margin-left: 10px;
           }

           .rbc-event {
             border: none;
             box-sizing: border-box;
             box-shadow: none;
             margin: 0;
             padding: 2px 5px;
             background-color: #3174ad;
             border-radius: 5px;
             color: #fff;
             cursor: pointer;
             width: 100%;
             text-align: left;
           }
           .rbc-slot-selecting .rbc-event {
             cursor: inherit;
             pointer-events: none;
           }
           .rbc-event.rbc-selected {
             background-color: #265985;
           }
           .rbc-event:focus {
             outline: 5px auto #3b99fc;
           }

           .rbc-event-label {
             font-size: 80%;
           }

           .rbc-event-overlaps {
             box-shadow: -1px 1px 5px 0px rgba(51, 51, 51, 0.5);
           }

           .rbc-event-continues-prior {
             border-top-left-radius: 0;
             border-bottom-left-radius: 0;
           }

           .rbc-event-continues-after {
             border-top-right-radius: 0;
             border-bottom-right-radius: 0;
           }

           .rbc-event-continues-earlier {
             border-top-left-radius: 0;
             border-top-right-radius: 0;
           }

           .rbc-event-continues-later {
             border-bottom-left-radius: 0;
             border-bottom-right-radius: 0;
           }

           .rbc-row {
             display: flex;
             flex-direction: row;
           }

           .rbc-row-segment {
             padding: 0 1px 1px 1px;
           }

           .rbc-selected-cell {
             background-color: rgba(0, 0, 0, 0.1);
           }

           .rbc-show-more {
             background-color: rgba(255, 255, 255, 0.3);
             z-index: 4;
             font-weight: bold;
             font-size: 85%;
             height: auto;
             line-height: normal;
           }

           .rbc-month-view {
             position: relative;
             border: 1px solid #ddd;
             display: flex;
             flex-direction: column;
             flex: 1 0 0;
             width: 100%;
             user-select: none;
             -webkit-user-select: none;
             height: 100%;
           }

           .rbc-month-header {
             display: flex;
             flex-direction: row;
           }

           .rbc-month-row {
             display: flex;
             position: relative;
             flex-direction: column;
             flex: 1 0 0;
             flex-basis: 0px;
             overflow: hidden;
             height: 100%;
           }
           .rbc-month-row + .rbc-month-row {
             border-top: 1px solid #ddd;
           }

           .rbc-date-cell {
             flex: 1 1 0;
             min-width: 0;
             padding-right: 5px;
             text-align: right;
           }
           .rbc-date-cell.rbc-now {
             font-weight: bold;
           }
           .rbc-date-cell > a,
           .rbc-date-cell > a:active,
           .rbc-date-cell > a:visited {
             color: inherit;
             font-weight: bold;
             text-decoration: none;
           }

           .rbc-row-bg {
             display: flex;
             flex-direction: row;
             flex: 1 0 0;
             overflow: hidden;
           }

           .rbc-day-bg {
             flex: 1 0 0%;
           }
           .rbc-day-bg + .rbc-day-bg {
             border-left: 1px solid #ddd;
           }
           .rbc-rtl .rbc-day-bg + .rbc-day-bg {
             border-left-width: 0;
             border-right: 1px solid #ddd;
           }

           .rbc-overlay {
             position: absolute;
             z-index: 5;
             border: 1px solid #e5e5e5;
             background-color: #fff;
             box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
             padding: 10px;
           }
           .rbc-overlay > * + * {
             margin-top: 1px;
           }

           .rbc-overlay-header {
             border-bottom: 1px solid #e5e5e5;
             margin: -10px -10px 5px -10px;
             padding: 2px 10px;
           }

           .rbc-agenda-view {
             display: flex;
             flex-direction: column;
             flex: 1 0 0;
             overflow: auto;
           }
           .rbc-agenda-view table.rbc-agenda-table {
             width: 100%;
             border: 1px solid #ddd;
             border-spacing: 0;
             border-collapse: collapse;
           }
           .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
             padding: 5px 10px;
             vertical-align: top;
           }
           .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-time-cell {
             padding-left: 15px;
             padding-right: 15px;
             text-transform: lowercase;
           }
           .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td {
             border-left: 1px solid #ddd;
           }
           .rbc-rtl
             .rbc-agenda-view
             table.rbc-agenda-table
             tbody
             > tr
             > td
             + td {
             border-left-width: 0;
             border-right: 1px solid #ddd;
           }
           .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr {
             border-top: 1px solid #ddd;
           }
           .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
             padding: 3px 5px;
             text-align: left;
             border-bottom: 1px solid #ddd;
           }
           .rbc-rtl .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
             text-align: right;
           }

           .rbc-agenda-time-cell {
             text-transform: lowercase;
           }
           .rbc-agenda-time-cell .rbc-continues-after:after {
             content: " »";
           }
           .rbc-agenda-time-cell .rbc-continues-prior:before {
             content: "« ";
           }

           .rbc-agenda-date-cell,
           .rbc-agenda-time-cell {
             white-space: nowrap;
           }

           .rbc-agenda-event-cell {
             width: 100%;
           }

           .rbc-time-column {
             display: flex;
             flex-direction: column;
             min-height: 100%;
           }
           .rbc-time-column .rbc-timeslot-group {
             flex: 1;
           }

           .rbc-timeslot-group {
             border-bottom: 1px solid #ddd;
             min-height: 40px;
             display: flex;
             flex-flow: column nowrap;
           }

           .rbc-time-gutter,
           .rbc-header-gutter {
             flex: none;
           }

           .rbc-label {
             padding: 0 5px;
           }

           .rbc-day-slot {
             position: relative;
           }
           .rbc-day-slot .rbc-events-container {
             bottom: 0;
             left: 0;
             position: absolute;
             right: 0;
             margin-right: 10px;
             top: 0;
           }
           .rbc-day-slot .rbc-events-container.rbc-rtl {
             left: 10px;
             right: 0;
           }
           .rbc-day-slot .rbc-event {
             border: 1px solid #265985;
             display: flex;
             max-height: 100%;
             min-height: 20px;
             flex-flow: column wrap;
             align-items: flex-start;
             overflow: hidden;
             position: absolute;
           }
           .rbc-day-slot .rbc-event-label {
             flex: none;
             padding-right: 5px;
             width: auto;
           }
           .rbc-day-slot .rbc-event-content {
             width: 100%;
             flex: 1 1 0;
             word-wrap: break-word;
             line-height: 1;
             height: 100%;
             min-height: 1em;
           }
           .rbc-day-slot .rbc-time-slot {
             border-top: 1px solid #f7f7f7;
           }

           .rbc-time-view-resources .rbc-time-gutter,
           .rbc-time-view-resources .rbc-time-header-gutter {
             position: sticky;
             left: 0;
             background-color: white;
             border-right: 1px solid #ddd;
             z-index: 10;
             margin-right: -1px;
           }

           .rbc-time-view-resources .rbc-time-header {
             overflow: hidden;
           }

           .rbc-time-view-resources .rbc-time-header-content {
             min-width: auto;
             flex: 1 0 0;
             flex-basis: 0px;
           }

           .rbc-time-view-resources .rbc-time-header-cell-single-day {
             display: none;
           }

           .rbc-time-view-resources .rbc-day-slot {
             min-width: 140px;
           }

           .rbc-time-view-resources .rbc-header,
           .rbc-time-view-resources .rbc-day-bg {
             width: 140px;
             flex: 1 1 0;
             flex-basis: 0 px;
           }

           .rbc-time-header-content + .rbc-time-header-content {
             margin-left: -1px;
           }

           .rbc-time-slot {
             flex: 1 0 0;
           }
           .rbc-time-slot.rbc-now {
             font-weight: bold;
           }

           .rbc-day-header {
             text-align: center;
           }

           .rbc-slot-selection {
             z-index: 10;
             position: absolute;
             background-color: rgba(0, 0, 0, 0.5);
             color: white;
             font-size: 75%;
             width: 100%;
             padding: 3px;
           }

           .rbc-slot-selecting {
             cursor: move;
           }

           .rbc-time-view {
             display: flex;
             flex-direction: column;
             flex: 1;
             width: 100%;
             border: 1px solid #ddd;
             min-height: 0;
           }
           .rbc-time-view .rbc-time-gutter {
             white-space: nowrap;
           }
           .rbc-time-view .rbc-allday-cell {
             box-sizing: content-box;
             width: 100%;
             height: 100%;
             position: relative;
           }
           .rbc-time-view .rbc-allday-cell + .rbc-allday-cell {
             border-left: 1px solid #ddd;
           }
           .rbc-time-view .rbc-allday-events {
             position: relative;
             z-index: 4;
           }
           .rbc-time-view .rbc-row {
             box-sizing: border-box;
             min-height: 20px;
           }

           .rbc-time-header {
             display: flex;
             flex: 0 0 auto;
             flex-direction: row;
           }
           .rbc-time-header.rbc-overflowing {
             border-right: 1px solid #ddd;
           }
           .rbc-rtl .rbc-time-header.rbc-overflowing {
             border-right-width: 0;
             border-left: 1px solid #ddd;
           }
           .rbc-time-header > .rbc-row:first-child {
             border-bottom: 1px solid #ddd;
           }
           .rbc-time-header > .rbc-row.rbc-row-resource {
             border-bottom: 1px solid #ddd;
           }

           .rbc-time-header-cell-single-day {
             display: none;
           }

           .rbc-time-header-content {
             flex: 1;
             display: flex;
             min-width: 0;
             flex-direction: column;
             border-left: 1px solid #ddd;
           }
           .rbc-rtl .rbc-time-header-content {
             border-left-width: 0;
             border-right: 1px solid #ddd;
           }
           .rbc-time-header-content > .rbc-row.rbc-row-resource {
             border-bottom: 1px solid #ddd;
             flex-shrink: 0;
           }

           .rbc-time-content {
             display: flex;
             flex: 1 0 0%;
             align-items: flex-start;
             width: 100%;
             border-top: 2px solid #ddd;
             overflow-y: auto;
             position: relative;
           }
           .rbc-time-content > .rbc-time-gutter {
             flex: none;
           }
           .rbc-time-content > * + * > * {
             border-left: 1px solid #ddd;
           }
           .rbc-rtl .rbc-time-content > * + * > * {
             border-left-width: 0;
             border-right: 1px solid #ddd;
           }
           .rbc-time-content > .rbc-day-slot {
             width: 100%;
             user-select: none;
             -webkit-user-select: none;
           }

           .rbc-current-time-indicator {
             position: absolute;
             z-index: 3;
             left: 0;
             right: 0;
             height: 1px;
             background-color: #74ad31;
             pointer-events: none;
           }
         `}</style>
       </>
     );
   } else {
      return(<p>Redirecting...</p>)
   }
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)

    console.log(jwt.decode(cookies.jamesworldwidetoken).username+' loaded calendar')
    // Pass data to the page via props
    return { props: { Cookie: cookies } };
  }

export default Index;

