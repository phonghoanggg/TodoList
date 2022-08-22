import { Button } from "antd";
import React, { useState } from "react";
import "./Control.css";
function Control(props) {
  return (
    <div className="control">
      <span>
        <Button onClick={() => props.setCheck(0)} style={{ marginRight: 10 }}>
          All
        </Button>
        <Button onClick={() => props.setCheck(1)} style={{ marginRight: 10 }}>
          Completed
        </Button>
        <Button onClick={() => props.setCheck(-1)}>Incomplete</Button>
      </span>
      <span></span>
    </div>
  );
}

export default Control;
