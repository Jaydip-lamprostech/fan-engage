import React from "react";

function SetQRCode(props) {
  return (
    <div className="set-qr-main">
      <div>
        <h3>Set QR Position</h3>
        <button
          onClick={() => {
            props.setPosition({
              ...props.position,
              x: props.position.x - 10,
            });
          }}
          className="x-minus-position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </button>
        <button
          onClick={() =>
            props.setPosition({ ...props.position, x: props.position.x + 10 })
          }
          className="x-plus-position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </svg>
        </button>
        <button
          onClick={() =>
            props.setPosition({ ...props.position, y: props.position.y + 10 })
          }
          className="y-plus-position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M480-345 240-585l56-56 184 183 184-183 56 56-240 240Z" />
          </svg>
        </button>
        <button
          onClick={() => {
            props.setPosition({
              ...props.position,
              y: props.position.y - 10,
            });
          }}
          className="y-minus-position"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="m296-345-56-56 240-240 240 240-56 56-184-183-184 183Z" />
          </svg>
        </button>
      </div>
      <div>
        <h3>Set QR Size</h3>
        <button onClick={() => props.setQrSize((prev) => prev + 10)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </button>
        <button onClick={() => props.setQrSize((prev) => prev - 10)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path d="M200-440v-80h560v80H200Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SetQRCode;
