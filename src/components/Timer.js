import React, {useState,useEffect} from 'react';
import './Home.css';

function Timer(props) {

  const [timeLeft, setTimeLeft] = useState(calculate());
  useEffect(() => {
    const id = setTimeout(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  });

const timerComponents = Object.keys(timeLeft).map(interval => {
  if (!timeLeft[interval]) {
    return('');
  }
  return (
    <span>
      {timeLeft[interval]} {interval}{" "}
    </span>
  );
});

function calculate () {
  const difference = +new Date(props.date) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }
  return timeLeft;
}

  const calculateTimeLeft = () => {
    const difference = +new Date(props.date) - +new Date();
    const className = (difference <= 1800000) ? 'blink' : '';
    return (<div class={className}>
      {timerComponents.length ? timerComponents : <span>Expired!</span>}
    </div>);
  }

  return (calculateTimeLeft());
}

export default Timer;
