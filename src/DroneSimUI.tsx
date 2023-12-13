import {
  Accordion,
  AccordionItem,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { Filter, Settings } from "lucide-react";
import { useCallback, useState } from "react";

export type DroneFlags = {
  circle?: boolean;
  triangle?: boolean;
  square?: boolean;
};

export const DroneSimUI = ({
  onFilterChange,
  onCreateDrones,
}: {
  onFilterChange: (filter: DroneFlags) => void;
  onCreateDrones: (types: DroneFlags, amount: number) => void;
}) => {
  const [visibleDroneTypes, setVisibleDroneTypes] = useState<string[]>([
    "circle",
    "triangle",
    "square",
  ]);

  const [droneTypesToAdd, setDroneTypesToAdd] = useState<string[]>([
    "circle",
    "triangle",
    "square",
  ]);

  const [numberOfDronesToAdd, setNumberOfDronesToAdd] = useState<string>("10");

  const addDrones = useCallback(
    (dronetypes: DroneFlags, amount: number) => {
      onCreateDrones(dronetypes, amount);
    },
    [onCreateDrones]
  );

  const filterValuesChanged = useCallback(
    (values: string[]) => {
      setVisibleDroneTypes(values);
      onFilterChange(droneTypeListToFlags(values));
    },
    [onFilterChange, setVisibleDroneTypes]
  );

  return (
    <div className="dark text-foreground bg-background z-10 absolute right-4 top-4 p-4 shadow-lg shadow-cyan-500/50 border-cyan-700 border rounded w-[300px] opacity-95">
      <div className="max-w-md">
        <div className="space-y-1">
          <h4 className="text-medium font-medium">Drones</h4>
          <p className="text-small text-default-400">Drone simulator</p>
        </div>

        <Tabs
          variant="underlined"
          classNames={{
            base: "w-full pt-4",
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#22d3ee]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          }}
        >
          <Tab
            key="filters"
            title={
              <div className="flex items-center space-x-2">
                <Filter width="16" />
                <span>Filter</span>
              </div>
            }
          >
            <CheckboxGroup
              label="Visible drone types"
              value={visibleDroneTypes}
              onValueChange={filterValuesChanged}
            >
              <Checkbox value="circle">Circle</Checkbox>
              <Checkbox value="triangle">Triangle</Checkbox>
              <Checkbox value="square">Square</Checkbox>
            </CheckboxGroup>
          </Tab>
          <Tab
            key="sim"
            title={
              <div className="flex items-center space-x-2">
                <Settings width="16" />
                <span>Drones</span>
              </div>
            }
          >
            <Accordion
              defaultExpandedKeys={["single"]}
              isCompact={true}
              variant="light"
            >
              <AccordionItem
                key="single"
                aria-label="Single"
                subtitle="add drones one by one"
                title="Single"
              >
                <div className="flex flex-col gap-2 pb-2">
                  <ButtonGroup>
                    <Button onClick={() => addDrones({ square: true }, 1)}>
                      Square
                    </Button>
                    <Button onClick={() => addDrones({ circle: true }, 1)}>
                      Circle
                    </Button>
                    <Button onClick={() => addDrones({ triangle: true }, 1)}>
                      Triangle
                    </Button>
                  </ButtonGroup>
                </div>
              </AccordionItem>
              <AccordionItem
                key="multiple"
                aria-label="Multiple"
                subtitle="add multiple drones"
                title="Multiple"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold">Types</h3>
                  <CheckboxGroup
                    orientation="vertical"
                    color="secondary"
                    value={droneTypesToAdd}
                    onValueChange={setDroneTypesToAdd}
                  >
                    <Checkbox value="circle">Circle</Checkbox>
                    <Checkbox value="triangle">Triangle</Checkbox>
                    <Checkbox value="square">Square</Checkbox>
                  </CheckboxGroup>

                  <h3 className="font-bold">Number of each type</h3>

                  <Input
                    type="number"
                    labelPlacement="outside"
                    min={1}
                    onValueChange={setNumberOfDronesToAdd}
                    value={numberOfDronesToAdd}
                  />

                  <div className="flex flex-row-reverse">
                    <Button
                      onClick={() =>
                        addDrones(
                          droneTypeListToFlags(droneTypesToAdd),
                          Number.parseInt(numberOfDronesToAdd)
                        )
                      }
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

function droneTypeListToFlags(typelist: string[]): DroneFlags {
  return {
    circle: typelist.includes("circle"),
    square: typelist.includes("square"),
    triangle: typelist.includes("triangle"),
  };
}
