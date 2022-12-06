import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import * as locales from 'react-date-range/dist/locale';

import moment from 'moment';

import format from 'date-fns/format'
import { addDays } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRangeComp = () => {

  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ])

  // Cacul du temps de location
  var ONE_DAY = 1000 * 60 * 60 * 24;

  var date1_ms = range[0].startDate.getTime();
  var date2_ms = range[0].endDate.getTime();

  var difference_ms = Math.abs(date1_ms - date2_ms);

  const [locStart, setLocStart] = useState();
  const [locEnd, setLocEnd] = useState();
  const [dureeLoc, setDureeLoc] = useState()

  useEffect(()=> {
    setLocStart(new Date(date1_ms).toLocaleDateString("fr"))
    setLocEnd(new Date(date2_ms).toLocaleDateString("fr"))
    setDureeLoc(Math.round(difference_ms/ONE_DAY)+1)
  }, [range])

  // console.log(locStart, locEnd, dureeLoc);


  // open close
  const [open, setOpen] = useState(false)

  // get the target element to toggle 
  const refOne = useRef(null)

  useEffect(() => {
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
  }, [])

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    // console.log(e.key)
    if( e.key === "Escape" ) {
      setOpen(false)
    }
  }

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if( refOne.current && !refOne.current.contains(e.target) ) {
      setOpen(false)
    }
  }


  return (
    <div className="calendarWrap">

      <input
        value={`${format(range[0].startDate, "dd/MM/yyyy")} au ${format(range[0].endDate, "dd/MM/yyyy")}`}
        readOnly
        className="inputBox"
        onClick={ () => setOpen(open => !open) }
      />

      <div ref={refOne}>
        {open && 
          <DateRange
            locale={locales['fr']}
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
            minDate={moment().toDate()}
          />
        }
      </div>

    </div>
  )
}

export default DateRangeComp