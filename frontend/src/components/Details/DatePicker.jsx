import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range'
import * as locales from 'react-date-range/dist/locale';

import moment from 'moment';

import format from 'date-fns/format'
import { addDays } from 'date-fns'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const DateRangeComp = ({ handleChange }) => {

  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ])
  console.log('toto')


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
    if (e.key === "Escape") {
      setOpen(false)
    }
  }

  // Hide on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false)
    }
  }


  return (
    <div className="calendarWrap">

      <input
        value={`${format(range[0].startDate, "dd/MM/yyyy")} au ${format(range[0].endDate, "dd/MM/yyyy")}`}
        readOnly
        className="inputBox"
        onClick={() => setOpen(open => !open)}
      />

      <div ref={refOne}>
        {open &&
          <DateRange
            locale={locales['fr']}
            onChange={item => (handleChange(item, [item.selection]), setRange([item.selection]))}
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