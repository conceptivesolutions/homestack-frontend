import React, {useState} from 'react';
import Select from "react-select";
import styles from "./ZoomComponent.module.scss"

interface IZoomComponent
{
  handle?: (pHandle: IZoomComponentHandle) => void,
  onZoomChange?: (pValue: number) => void
  children?: React.ReactNode,
  value?: number,
}

export interface IZoomComponentHandle
{
  setValue: (pValue: number) => void
}

const ZoomComponent = (props: IZoomComponent) =>
{
  const [value, setValue] = useState<number>(1)

  // fire callback
  if (!!props.handle)
    props.handle({setValue})

  return (
    <div className={styles.zoom}>
      <Select components={{DropdownIndicator: () => null, IndicatorSeparator: () => null}}
              menuPlacement={"top"}
              isSearchable={false}
              options={[
                {label: "25 %", value: 0.25},
                {label: "50 %", value: 0.5},
                {label: "75 %", value: 0.75},
                {label: "100 %", value: 1},
                {label: "125 %", value: 1.25},
                {label: "150 %", value: 1.5},
                {label: "175 %", value: 1.75},
                {label: "200 %", value: 2},
              ]}
              onChange={pValue =>
              {
                if (props.onZoomChange)
                  props.onZoomChange(pValue?.value || 1);
                setValue(pValue?.value as number);
              }}
              styles={{
                control: base => ({
                  ...base,
                  backgroundColor: "transparent",
                  border: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    border: 'none',
                  }
                }),
                menu: base => ({
                  ...base,
                  marginBottom: 4,
                })
              }}
              value={{label: Math.round(value * 100) + " %", value}}
              theme={pTheme => ({
                ...pTheme,
                spacing: {
                  ...pTheme.spacing,
                  baseUnit: 0.8,
                  controlHeight: 0.8,
                }
              })}/>
    </div>
  )
};

export default ZoomComponent;
