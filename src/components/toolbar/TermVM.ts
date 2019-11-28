import { IDatePickerStrings, mergeStyleSets } from "office-ui-fabric-react";
import { BindableBase } from "../../BindableBase";

export const controlClass = mergeStyleSets({
  control: {
    margin: "0 0 15px 0",
    maxWidth: "300px",
  },
});

const months = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

export const DayPickerStrings: IDatePickerStrings = {
  months: months,

  shortMonths: months,

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today",
  prevMonthAriaLabel: "Go to previous month",
  nextMonthAriaLabel: "Go to next month",
  prevYearAriaLabel: "Go to previous year",
  nextYearAriaLabel: "Go to next year",
  closeButtonAriaLabel: "Close date picker",
};

export default class TermVM extends BindableBase {
  public value: Date | undefined;
  public strings = DayPickerStrings;
  public formatDate = (date?: Date): string => {
    return date ? date.toLocaleDateString() : "";
  };
  public readonly allowTextInput = true;

  public onSelectDate = (date: Date | null | undefined): void => {
    this.value = date || undefined;
    this.onPropertyChanged();
  };
}
