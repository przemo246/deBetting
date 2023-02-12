import { CSSProperties } from "react";

export const CountdownRenderer = ({
  hours,
  minutes,
  seconds,
  completed,
  days,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
  days: number;
}) => {
  if (completed) {
    return <div>Match in progress...</div>;
  }
  if (days > 0) {
    return <div>{`Match starts in ${days} days`}</div>;
  }
  const hoursStyle = { "--value": hours } as CSSProperties;
  const minutesStyle = { "--value": minutes } as CSSProperties;
  const secondsStyle = { "--value": seconds } as CSSProperties;
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-xl">
          <span style={hoursStyle}></span>
        </span>
        hours
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-xl">
          <span style={minutesStyle}></span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-xl">
          <span style={secondsStyle}></span>
        </span>
        sec
      </div>
    </div>
  );
};
