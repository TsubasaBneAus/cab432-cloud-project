"use client";

import { Tabs, Tab } from "@nextui-org/react";

const EditingTabs = (props) => {
  return (
    <Tabs 
        aria-label="Options"         
        selectedKey={props.keys[0]}
        onSelectionChange={props.setKey}
      >
        <Tab key={props.keys[0]} title={props.titles[0]} />
        <Tab key={props.keys[1]} title={props.titles[1]} />
        <Tab key={props.keys[2]} title={props.titles[2]} />
      </Tabs>
  )
};

export default EditingTab;
