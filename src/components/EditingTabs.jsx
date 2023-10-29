"use client";

import { Tabs, Tab } from "@nextui-org/react";

const EditingTabs = (props) => {
  let tabArray = [];
  const keys = props.option.values;
  for (let i = 0; i < keys.length; i++) {
    tabArray.push(<Tab key={keys[i]} title={keys[i]} />);
  }

  return (
    <div className="w-full">
      <p className="mb-1 text-xl">{props.option.title}</p>
      <Tabs
        classNames={{
          tabList: "bg-slate-900",
          tabContent: "text-white",
        }}
        aria-label="Options"
        color="primary"
        selectedKey={props.selected}
        onSelectionChange={props.setSelected}
      >
        {tabArray}
      </Tabs>
    </div>
  );
};

export default EditingTabs;
